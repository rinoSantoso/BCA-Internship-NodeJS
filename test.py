import sys, json, numpy as np
import pandas as pd
from prophet import Prophet
from prophet.diagnostics import cross_validation
from prophet.diagnostics import performance_metrics
import math
import os

# df = pd.read_csv('example_wp_log_peyton_manning.csv')
# print(df.head())

# m = Prophet()
# m.fit(df)

# future = m.make_future_dataframe(periods=365)
# print(future.tail())

# forecast = m.predict(future)
# print(forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].tail())

# df_cv = cross_validation(m, initial='730 days', period='180 days', horizon = '365 days')
# print(df_cv.head())

# df_p = performance_metrics(df_cv)
# print(df_p.head())

# dates = [2010]
# df = pd.DataFrame(columns=['ds', 'y'])
# df = df.append({'ds': pd.to_datetime(dates, format='%Y') + pd.offsets.YearEnd(), 'y': 'asdf'}, ignore_index=True)
# print(pd.to_datetime(dates, format='%Y') + pd.offsets.YearEnd())
# print(df)


# Supress Output
# Define a context manager to suppress stdout and stderr.
class suppress_stdout_stderr(object):
    def __enter__(self):
        self.outnull_file = open(os.devnull, 'w')
        self.errnull_file = open(os.devnull, 'w')

        self.old_stdout_fileno_undup    = sys.stdout.fileno()
        self.old_stderr_fileno_undup    = sys.stderr.fileno()

        self.old_stdout_fileno = os.dup ( sys.stdout.fileno() )
        self.old_stderr_fileno = os.dup ( sys.stderr.fileno() )

        self.old_stdout = sys.stdout
        self.old_stderr = sys.stderr

        os.dup2 ( self.outnull_file.fileno(), self.old_stdout_fileno_undup )
        os.dup2 ( self.errnull_file.fileno(), self.old_stderr_fileno_undup )

        sys.stdout = self.outnull_file        
        sys.stderr = self.errnull_file
        return self

    def __exit__(self, *_):        
        sys.stdout = self.old_stdout
        sys.stderr = self.old_stderr

        os.dup2 ( self.old_stdout_fileno, self.old_stdout_fileno_undup )
        os.dup2 ( self.old_stderr_fileno, self.old_stderr_fileno_undup )

        os.close ( self.old_stdout_fileno )
        os.close ( self.old_stderr_fileno )

        self.outnull_file.close()
        self.errnull_file.close()


#Read data from stdin
def read_in():
    lines = sys.stdin.readlines()
    # lines = ['{"no_id":1027,"dpk_2010":26962.47,"dpk_2011":29850.88,"dpk_2012":31399.86,"dpk_2013":34622.96,"dpk_2014":35990.53,"dpk_2015":36491.64,"dpk_2016":39000.1,"dpk_2017":43107.32,"dpk_2018":45852.2,"dpk_2019":48469.51,"laba_rugi_2010":247.92,"laba_rugi_2011":267.47,"laba_rugi_2012":292.03,"laba_rugi_2013":303.42,"laba_rugi_2014":326.59,"laba_rugi_2015":345.77,"laba_rugi_2016":350.86,"laba_rugi_2017":379.67,"laba_rugi_2018":418.63,"laba_rugi_2019":461.71}']
    #Since our input would only be having one line, parse our JSON data from that
    return json.loads(lines[0])

def mean_absolute_percentage_error(y_true, y_pred):
        y_true, y_pred = np.array(y_true), np.array(y_pred)
        return np.mean(np.abs((y_true - y_pred) / y_true)) * 100

def mse(y_true, y_pred):
        y_true, y_pred = np.array(y_true), np.array(y_pred)
        return 1 - (np.sum((y_true-y_pred)**2)/np.sum((y_true-np.mean(y_true))**2))

def main():
    #get our data as an array from read_in()
    data = read_in()

    df = pd.DataFrame(columns=['ds', 'y'])


    year = 2010

    for key in data.keys():
        if "laba_rugi" in key:
            df = df.append({'ds': (pd.to_datetime(year, format='%Y') + pd.offsets.YearEnd()).strftime('%Y-%m-%d'), 'y': data[key]}, ignore_index=True)
            year += 1
    
    df_train = df.iloc[:5,:]
    df_test = df.iloc[6:,:]

    m_split = Prophet()
    m = Prophet()

    with suppress_stdout_stderr():
        m_split.fit(df_train)
        m.fit(df)

    future_b = m_split.make_future_dataframe(periods=6, freq='Y')
    future = m.make_future_dataframe(periods=3, freq='Y')    

    with suppress_stdout_stderr():
        df_cv = cross_validation(m, initial='2,190 days', horizon='365 days')
    
    # print('cross validation dataframe')
    # print(df_cv)

    # df_p = performance_metrics(df_cv)
    # print(df_p.head())

    forecast = m.predict(future)
    # print('\nprediction dataframe')
    # print(forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].to_json(orient="records"))
    forecast_clean = forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].tail(3)

    
    mape = mean_absolute_percentage_error(df_cv.y, df_cv.yhat)
    mean_squared_error = mse(df_cv.y, df_cv.yhat)
    rmse = math.sqrt(mean_squared_error)

    # output = {'cross validation dataframe': json.loads(df_cv.to_json(orient='records')), 'prediction dataframe': json.loads(forecast.to_json(orient='records')), 'mape': mape, 'mse': mean_squared_error, 'rmse': rmse}
    output = {'prediction dataframe': json.loads(forecast_clean.to_json(orient='records')), 'mape': mape, 'mse': mean_squared_error, 'rmse': rmse}

    print(json.dumps(output))
    # print(json.dumps(json.loads(df_cv.to_json(orient="records"))))

#start process
if __name__ == '__main__':
    main()


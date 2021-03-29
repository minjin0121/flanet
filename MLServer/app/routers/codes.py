def prophet_code(item, period_value, cps):

    s = []
    s.append("import warnings")
    s.append("warnings.filterwarnings('ignore')")
    s.append("import pandas as pd")
    s.append("from fbprophet import Prophet")
    s.append("conv_df = 'csv 데이터 입력'")
    s.append("df = pd.DataFrame({'ds': conv_df.index, 'y': conv_df[" + item + "]})")
    s.append("m = Prophet(daily_seasonality=True, changepoint_prior_scale=" + str(cps) + ")")
    s.append("m.fit(df)")
    s.append("future = m.make_future_dataframe(periods=" + str(period_value) + ")")
    s.append("forecast = m.predict(future)")
    s.append("result = forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']]")
    s.append("conv_df = conv_df.rename({'Date': 'ds'}, axis='columns')")
    s.append("conv_df['ds'] = conv_df['ds'].astype('datetime64[ns]')")
    s.append("result = pd.merge(result, conv_df, how='outer', on='ds')")
    s.append("print(result)")

    return s
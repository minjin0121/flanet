def prophet_code(item, period_value, cps):

    s = ""
    s += "import warnings\n\n"
    s += "warnings.filterwarnings('ignore')\n\n"
    s += "import pandas as pd\n"
    s += "from fbprophet import Prophet\n\n\n"
    s += "conv_df = 'csv 데이터 입력'\n\n"
    s += "df = pd.DataFrame({'ds': conv_df.index, 'y': conv_df[" + item + "]})\n\n"
    s += "m = Prophet(daily_seasonality=True, changepoint_prior_scale=" + str(cps) + ")\n\n"
    s += "m.fit(df)\n\n"
    s += "future = m.make_future_dataframe(periods=" + str(period_value) + ")\n\n"
    s += "future['day'] = future['ds'].dt.weekday\n"
    s += "future = future[future['day'] <= 4]\n\n"

    s += "forecast = m.predict(future)\n\n"

    s += "s = set(['ds', 'yhat', 'trend', 'weekly', 'yearly'])\n\n"
    s += "if s.issubset(set(forecast.columns)):\n"
    s += "  result = forecast[['ds', 'yhat', 'trend', 'weekly', 'yearly']]\n"
    s += "else: \n"
    s += "  result = forecast[['ds', 'yhat', 'trend', 'weekly']]\n\n"

    s += "conv_df = conv_df.rename({'Date': 'ds'}, axis='columns')\n\n"
    s += "conv_df['ds'] = conv_df['ds'].astype('datetime64[ns]')\n\n"
    s += "result = pd.merge(result, conv_df, how='outer', on='ds')\n\n"
    s += "print(result)\n"

    return s
import warnings

warnings.filterwarnings("ignore")
import pandas as pd

from fbprophet import Prophet


def prophet_stock(df_input, item, period_value):
    # 데이터 입력, 전처리
    df = pd.DataFrame({"ds": df_input.index, "y": df_input[item]})

    # prophet object 생성
    m = Prophet(daily_seasonality=True)

    m.fit(df)

    # 예측값을 넣을 데이터 프레임 생성. 인자로 들어가는 periods는 단위 주기(일)
    future = m.make_future_dataframe(periods=period_value)

    forecast = m.predict(future)

    return forecast[["ds", "yhat"]]
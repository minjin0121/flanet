# 표준 라이브러리
from os import path, remove
import json

# 서드 파티 라이브러리
from sklearn.preprocessing import MinMaxScaler
from keras.models import Sequential, load_model
from keras.layers import LSTM, Dropout, Dense, Flatten, AveragePooling1D
from keras.layers.convolutional import Conv1D, MaxPooling1D
from keras.callbacks import ModelCheckpoint, EarlyStopping, ReduceLROnPlateau
from keras.optimizers import Adam
import pandas as pd
import numpy as np
import requests

# 로컬
from database import crud


def data_preprocessing(input_data):
    input_dataframe = csv_format_to_dataframe(input_data)
    input_dataframe.dropna(inplace=True)

    look_back = 14
    processed_data = input_dataframe["Date"].loc[look_back : input_dataframe.shape[0] - 2]
    processed_data.reset_index(drop=True, inplace=True)

    scaler = MinMaxScaler()
    scale_data = scaler.fit_transform(
        input_dataframe["Close"].values.reshape(input_dataframe["Close"].shape[0], 1)
    )

    x_data, y_data = process_data(scale_data, look_back)
    train_pct = 0.80

    x_train, x_test = (
        x_data[: int(x_data.shape[0] * train_pct)],
        x_data[int(x_data.shape[0] * train_pct) :],
    )
    y_train, y_test = (
        y_data[: int(y_data.shape[0] * train_pct)],
        y_data[int(y_data.shape[0] * train_pct) :],
    )

    x_train = x_train.reshape((x_train.shape[0], x_train.shape[1], 1))
    x_test = x_test.reshape((x_test.shape[0], x_test.shape[1], 1))

    x_train_columns = [f"x_train_{i}" for i in range(look_back)]
    x_test_columns = [f"x_test_{i}" for i in range(look_back)]

    # processed_data = pd.DataFrame(y_data, columns=["actual"])
    actual_data = pd.DataFrame(y_data, columns=["actual"])
    x_train = pd.DataFrame(x_train.reshape(-1, 14), columns=x_train_columns)
    x_test = pd.DataFrame(x_test.reshape(-1, 14), columns=x_test_columns)
    y_train = pd.DataFrame(y_train, columns=["y_train"])
    y_test = pd.DataFrame(y_test, columns=["y_test"])
    scale = pd.DataFrame(scaler.scale_, columns=["scale"])

    processed_data = pd.concat([processed_data, actual_data], axis=1)
    processed_data = pd.concat([processed_data, x_train], axis=1)
    processed_data = pd.concat([processed_data, x_test], axis=1)
    processed_data = pd.concat([processed_data, y_train], axis=1)
    processed_data = pd.concat([processed_data, y_test], axis=1)
    processed_data = pd.concat([processed_data, scale], axis=1)

    return processed_data.to_csv(index=False)


def cnn_model_training(input_data, training_model_id, user_id, db):
    x_train, x_test, y_train, y_test, scale = input_data_to_data_set(input_data)

    adam = Adam(lr=0.003)

    file_path = f"./asset/models/{user_id}.h5"
    callback_checkpoint = ModelCheckpoint(
        filepath=file_path, monitor="val_loss", save_best_only=True, save_weights_only=False
    )
    early_stopping = EarlyStopping(monitor="val_loss", patience=20, verbose=1)
    reduce_lr = ReduceLROnPlateau(monitor="val_loss", factor=0.3, patience=5, min_lr=0.0009)
    callbacks = [early_stopping, callback_checkpoint, reduce_lr]

    model = Sequential()
    model.add(
        Conv1D(
            filters=64,
            kernel_size=2,
            activation="relu",
            input_shape=(x_train.shape[1], x_train.shape[2]),
        )
    )
    model.add(MaxPooling1D(pool_size=2))
    model.add(Conv1D(filters=64, kernel_size=2, activation="relu"))
    model.add(AveragePooling1D(pool_size=2))
    model.add(Flatten())
    model.add(Dense(50, activation="relu"))
    model.add(Dense(1))
    model.compile(optimizer="adam", loss="mse")

    history = model.fit(
        x_train,
        y_train,
        epochs=100,
        batch_size=16,
        validation_data=(x_test, y_test),
        callbacks=callbacks,
        shuffle=True,
    )

    training_model = crud.insert_training_model(
        training_model_id=training_model_id, training_model_name="ho", user_id=user_id, db=db
    )

    model_file = open(f"./asset/models/{user_id}.h5", "rb")
    req_upload = {"file": model_file}
    req_data = {"training_model_id": training_model.training_model_id}

    req = requests.post(
        "https://j4f002.p.ssafy.io/csv/upload/trainingmodel",
        files=req_upload,
        data=req_data,
    )

    remove(f"./asset/models/{user_id}.h5")

    return pd.DataFrame(history.history).to_csv(index=False)


def lstm_model_training(input_data, training_model_id, user_id, db):
    x_train, x_test, y_train, y_test, scale = input_data_to_data_set(input_data)

    adam = Adam(lr=0.003)

    file_path = f"./asset/models/{user_id}.h5"
    callback_checkpoint = ModelCheckpoint(
        filepath=file_path, monitor="val_loss", save_best_only=True, save_weights_only=False
    )
    early_stopping = EarlyStopping(monitor="val_loss", patience=20, verbose=1)
    reduce_lr = ReduceLROnPlateau(monitor="val_loss", factor=0.3, patience=5, min_lr=0.0009)
    callbacks = [early_stopping, callback_checkpoint, reduce_lr]

    model = Sequential()
    model.add(LSTM(32, input_shape=(x_train.shape[1], x_train.shape[2]), return_sequences=True))
    model.add(Dropout(0.1))
    model.add(LSTM(160))
    model.add(Dropout(0.1))
    model.add(Dense(1))
    model.compile(loss="mse", optimizer=adam)

    history = model.fit(
        x_train,
        y_train,
        epochs=100,
        batch_size=16,
        validation_data=(x_test, y_test),
        callbacks=callbacks,
        shuffle=True,
    )

    training_model = crud.insert_training_model(
        training_model_id=training_model_id, training_model_name="ho", user_id=user_id, db=db
    )

    model_file = open(f"./asset/models/{user_id}.h5", "rb")
    req_upload = {"file": model_file}
    req_data = {"training_model_id": training_model.training_model_id}

    req = requests.post(
        "https://j4f002.p.ssafy.io/csv/upload/trainingmodel",
        files=req_upload,
        data=req_data,
    )

    remove(f"./asset/models/{user_id}.h5")

    return pd.DataFrame(history.history).to_csv(index=False)


def model_evaluate(input_data, training_model_id):
    x_train, x_test, y_train, y_test, scale = input_data_to_data_set(input_data)

    model_file_path = f"./asset/models/{training_model_id}.h5"
    req = requests.get(f"https://j4f002.p.ssafy.io/csv/download/trainingmodel/{training_model_id}")
    model_file = open(model_file_path, "wb")
    model_file.write(req.content)
    trained_model = load_model(model_file_path)

    x_train_prediction = trained_model.predict(x_train) * scale
    x_test_prediction = trained_model.predict(x_test) * scale

    processed_data = pd.DataFrame(x_train_prediction, columns=["x_train_prediction"])
    x_test_prediction = pd.DataFrame(x_test_prediction, columns=["x_test_prediction"])

    processed_data = pd.concat([processed_data, x_test_prediction], axis=1)

    remove(model_file_path)

    return processed_data.to_csv(index=False)


def predict_future(input_data, training_model_id, period):
    look_back = 14
    x_train, x_test, y_train, y_test, scale = input_data_to_data_set(input_data)

    model_file_path = f"./asset/models/{training_model_id}.h5"
    req = requests.get(f"https://j4f002.p.ssafy.io/csv/download/trainingmodel/{training_model_id}")
    model_file = open(model_file_path, "wb")
    model_file.write(req.content)
    trained_model = load_model(model_file_path)

    callback_checkpoint = ModelCheckpoint(
        filepath=model_file_path, monitor="val_loss", save_best_only=True, save_weights_only=False
    )
    early_stopping = EarlyStopping(monitor="val_loss", patience=20, verbose=1)
    reduce_lr = ReduceLROnPlateau(monitor="val_loss", factor=0.3, patience=5, min_lr=0.0009)
    callbacks = [early_stopping, callback_checkpoint, reduce_lr]

    x_future = x_test
    y_future = y_test

    for i in range(1, period + 1):
        predict_value = trained_model.predict(x_future[-1].reshape(1, look_back, 1))[0][0]
        x_future = np.append(x_future, np.append(x_future[-1][1:], predict_value)).reshape(
            -1, look_back, 1
        )
        y_future = np.append(y_future, predict_value)

        if i % 25 == 0:
            trained_model.fit(
                x_future,
                y_future,
                epochs=100,
                batch_size=16,
                validation_data=(x_train, y_train),
                callbacks=callbacks,
                shuffle=True,
            )

    predicted_data = y_future[-period:].reshape(-1, 1) * scale

    remove(model_file_path)

    return pd.DataFrame(predicted_data, columns=["future"]).to_csv(index=False)


def csv_format_to_dataframe(data):
    split_data = json.loads(data).split("\n")
    split_data.pop(-1)

    ck = 1
    row_num = 0
    for data in split_data:
        if ck:
            ck = 0
            len_columns = len(data.split(","))
            data_columns = [data.split(",")[i] for i in range(len(data.split(",")))]
            df = pd.DataFrame(columns=data_columns)
        else:
            len_columns = len(data.split(","))
            df.loc[row_num] = [data.split(",")[i] for i in range(len(data.split(",")))]
            row_num += 1

    return df


def process_data(data, look_back):
    x_data, y_data = [], []
    for i in range(len(data) - look_back - 1):
        x_data.append(data[i : (i + look_back), 0])
        y_data.append(data[(i + look_back), 0])
    return np.array(x_data), np.array(y_data)


def input_data_to_data_set(input_data):
    look_back = 14
    input_data = csv_format_to_dataframe(input_data)

    input_data_cnt = input_data["actual"].to_numpy().shape[0]
    train_data_cnt = int(input_data_cnt * 0.8)
    test_data_cnt = input_data_cnt - train_data_cnt

    x_train = input_data[[f"x_train_{i}" for i in range(look_back)]]
    x_train = x_train.drop(index=[i for i in range(train_data_cnt, input_data_cnt)], axis=0)
    x_train = x_train.to_numpy().reshape(-1, 14, 1)
    x_train = x_train.astype(np.float64)

    x_test = input_data[[f"x_test_{i}" for i in range(look_back)]]
    x_test = x_test.drop(index=[i for i in range(test_data_cnt, input_data_cnt)], axis=0)
    x_test = x_test.to_numpy().reshape(-1, 14, 1)
    x_test = x_test.astype(np.float64)

    y_train = input_data[["y_train"]]
    y_train = y_train.drop(index=[i for i in range(train_data_cnt, input_data_cnt)], axis=0)
    y_train = y_train.to_numpy().reshape(-1)
    y_train = y_train.astype(np.float64)

    y_test = input_data[["y_test"]]
    y_test = y_test.drop(index=[i for i in range(test_data_cnt, input_data_cnt)], axis=0)
    y_test = y_test.to_numpy().reshape(-1)
    y_test = y_test.astype(np.float64)

    scale = 1 / input_data[["scale"]].loc[0].to_numpy().astype(np.float64)[0]

    return x_train, x_test, y_train, y_test, scale

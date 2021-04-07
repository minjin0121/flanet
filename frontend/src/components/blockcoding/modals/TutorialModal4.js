import PropTypes from "prop-types";
import React from "react";
import { useDispatch } from "react-redux";
import { setModalPage } from "../../../actions/index";

const TutorialModal4 = ({ open, close }) => {
  const dispatch = useDispatch();
  const prevModal = () => {
    dispatch(setModalPage(4));
    close();
  };
  const closeModal = () => {
    dispatch(setModalPage(0));
    close();
  };

  return (
    <div className={open ? "openModal modal" : "modal"}>
      {open ? (
        <section>
          <header>
            블록 코딩 활용
            {/* 3단계 : mypage or 단계별 모델 사용하기 */}
            <button className="close" onClick={closeModal}>
              &times;
            </button>
          </header>
          <main className="content">
            <h1>더 많은 예시</h1>
            앞서 배운 블록을 가지고 이제 다양한 블록 코딩 예시를 해보겠습니다.
            FlaNET에서는 자신 만의 딥러닝 모델도 가능합니다. 앞 페이지의 단계별
            딥러닝 학습을 세분화하여 딥러닝 모델커스튬 카테고리에서 딥러닝 관련
            모델 레이어를 가지고 자신만의 모델을 블록 코딩으로 만들 수 있습니다.
            <br />
            <br />
            <img
              src={`${process.env.PUBLIC_URL}/img/tutorual_4_1.png`}
              className="tutorial-img-1-1"
              alt="이미지"
            />
            <br />
            Convolution, Max-Pooling, Average-Pooling, Dropout, LSTM 모델
            레이어가 지원이 되며 여기서는 몇 가지 주의사항이 있습니다.
            <br />
            1. ~!~!~!~!또한 해당 모델을 생성할 때, LSTM과 Convolution 레이어가
            가장 맨 앞에 나와서 만들려고 하는 모델의 기준을 알려줘야합니다. cnn
            출력갑 ㅅ계산 ㄴㅇㄴㅇ 예제로 사용할 CNN 모델 정보는 다음과
            같습니다. 컨볼루션 레이어의 학습 파라미터 수는 입력채널 x 필터폭 x
            필터 높이 x 출력 채널 수로 계산 그러면 한 번 모델을
            생성해보겠습니다.
            <br />
            <br />
            <h3>모델 생성 예시</h3>
            LSTM과 CNN을 가지고 나만의 딥러닝 모델을 만드는 예시입니다. 모델
            생성 예시
            <br />
            <br />
            <img
              src={`${process.env.PUBLIC_URL}/img/tutorual_4_2.gif`}
              className="tutorial-img-1-3"
              alt="home_block"
            />
            <br />
            <br />
            <h2>제약 조건 및 권장 사항</h2>
            블록 코딩을 할 때 몇 가지 권장하는 것이 있습니다. 학습시간이 크다면
            <br />
            - 짧은 기간의 데이터(오류)
            <br />
            - 너무 긴 기간의 데이터나 예측기간(시간이 오래걸림)
            <br />
            - 너무 많은 레이어 수(시간이 오래걸림)
            <br />
            - 너무 높은 filters, units (시간이 오래걸림)
            <br />
            - 너무 높은 Dropout의 rate(결과를 다버려서 정확도가 떨어짐?)
            <br />
            그러나 CNN 딥러닝 모델은 만드는데 제약사항이 있습니다. alert
            <br />
            띄어지는 것 보여줘야하나? 일반적으로 출력 값 계산은 ~ 안좋은 예시
            <br />
            <br /> 위 ~
            <br />
            <br />
            이미지
            <br />
            <br />
            <div className="main-title">
              최고의 성능을 가지는 모델을 만들어보세요!
            </div>
          </main>
          <footer>
            <span className="foot-number">5 / 5</span>
            &nbsp;
            <button onClick={prevModal}> prev </button>&nbsp;
            <button className="disabled"> next </button>&nbsp;
            <button className="close" onClick={closeModal}>
              close
            </button>
          </footer>
        </section>
      ) : null}
    </div>
  );
};

TutorialModal4.propTypes = {
  open: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
};

export default TutorialModal4;

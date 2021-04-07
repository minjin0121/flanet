import PropTypes from "prop-types";
import React from "react";
import { useDispatch } from "react-redux";
import { setModalPage } from "../../../actions/index";

const TutorialModal3 = ({ open, close }) => {
  const dispatch = useDispatch();
  const nextModal = () => {
    dispatch(setModalPage(5));
    close();
  };
  const prevModal = () => {
    dispatch(setModalPage(3));
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
            블록 코딩을 위한 Workspace 사용 방법 - 2
            <button className="close" onClick={closeModal}>
              &times;
            </button>
          </header>
          <main className="content">
            <h2>4. 딥러닝 모델 학습</h2>
            <br />
            <img
              src={`${process.env.PUBLIC_URL}/img/tutorial_3_1.png`}
              className="tutorial-img-1-1"
              alt="home_block"
            />
            <br />
            통합 딥러닝 솔루션 같은 경우, 학습, 추론까지 고려해서 제공되는
            블록입니다. 그러나 딥러닝 모델 학습은 단순히 모델만 지원해 주고
            있습니다. 모델만 지원하기 때문에 추론이나 정확도 등 사용자가 직접
            다른 블록으로 이어 붙여야 완성된 형태가 됩니다. 데이터 분석을 더
            세분화하여 실제 딥러닝 실행 파이프라인과 같은 환경으로 블록 코딩을
            할 수 있습니다! 여기서는 LSTM와 CNN 모델 학습을 기본 블록으로
            제공하며, 이전에 학습한 모델이 있다면 불러와서 사용도 가능합니다.
            <br />
            <br />
            <br />
            <h2>5. 딥러닝 모델 커스텀</h2>
            <br />
            <img
              src={`${process.env.PUBLIC_URL}/img/tutorial_3_2.png`}
              className="tutorial-img-1-1"
              alt="home_block"
            />
            <br />
            각 모델들을 구성하는 레이어입니다. Convolution, Max-Pooling,
            Average-Pooling, Dropout, LSTM 모델 레이어가 지원되며 이 레이어를
            통해 자신만의 모델을 생성할 수 있습니다. 딥러닝 모델 학습 카테고리를
            더 세분화하며, 사용자가 직접 모델을 설계하고 학습을 할 수 있습니다.
            <br /> <br />
            다음 그림은 딥러닝 모델 커스텀을 통해 레이어로 모델을 직접 만드는
            예시입니다.기온 데이터를 학습데이터로 사용하고, 각 레이어들을
            이용하여 나만의 딥러닝 모델을 만들 수 있습니다. 더 자세한 건 다음
            장에서 설명하겠습니다.
            <br />
            <br />
            <br />
            <img
              src={`${process.env.PUBLIC_URL}/img/tutorial_3_3.gif`}
              className="tutorial-img-1-3"
              alt="home_block"
            />
            <br />
            <br />
            <br />
            <h2>6. 모델 평가 및 데이터 추론</h2>
            <br />
            <img
              src={`${process.env.PUBLIC_URL}/img/tutorial_3_4.png`}
              className="tutorial-img-1-3"
              alt="home_block"
            />
            <br />
            모델을 학습했으면, 이제 해당 모델을 평가해야합니다. 정확도가 얼마나
            되는지, 손실율이 어느정도인지 확인을 할 수 있는 학습 모델 평가
            블록과 이제 학습된 모델로 원하는 날만큼 추론을 할 수 있게 도와주는
            데이터 추론 블록을 지원합니다.
            <br />
            <br />
          </main>
          <footer>
            <span className="foot-number">4 / 5</span>
            &nbsp;
            <button onClick={prevModal}> prev </button>&nbsp;
            <button onClick={nextModal}> next </button>&nbsp;
            <button className="close" onClick={closeModal}>
              close
            </button>
          </footer>
        </section>
      ) : null}
    </div>
  );
};

TutorialModal3.propTypes = {
  open: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
};

export default TutorialModal3;
// 딥러닝 파이프라인에 맞춰 블록을 나눈다면 실행이 가능합니다. 여기서 가능한 실행 방법으로~~~이 있습니다.

/* <h1>단계별 딥러닝 학습</h1>
FlaNET에서는 데이터 분석을 더 세분화하여 실제 딥러닝 실행
파이프라인과 같은 환경으로 블록 코딩을 할 수 있습니다! 단계별 딥러닝
학습 카테고리를 이용하여 블록을 수집 - 전처리 - 학습 - 평가 -
추론으로 단위를 나누어서 사용이 가능합니다.
<br />
<br />
<h2>1. 단계별 학습 블록 코딩</h2>
<br />
<img
  src={`${process.env.PUBLIC_URL}/img/tutorual_3_1.png`}
  className="tutorial-img-1-1"
  alt="home_block"
/>
<br />
<h3>데이터 조회, 전처리 학습</h3>
앞서 수집한 데이터를 조회하고, 관련 데이터를 나눠서 훈련하고
테스트를 진행할 지 선택합니다. 여기서 훈련이란 모델을 학습하기 위한
작업입니다. 훈련 후, 테스트 데이터와 비교하여 성능을 평가합니다.
<br />
<br />
<h3>CNN, LSTM 모델 학습</h3>
데이터 조회와 전처리 작업이 끝났다면, 본격적으로 학습을
시작해야합니다. STEP 3에 해당하며 기본적으로 모델링이 된 CNN과 LSTM
블록을 제공됩니다. 또한 자신이 만든 모델 블록을 불러와 사용도
가능합니다.
<br />
<br />
<h3>학습 모델 평가, 추론</h3>
학습을 마친 후, 학습된 모델을 가지고 얼만큼 신뢰할 수 있는지 평가와
추론 결과가 나옵니다. 평가같은 경우, loss값과 정확도가 나오며 추론은
파라미터를 직접 넣어 그 기간만큼 예측을 수행합니다.
<br />
<br />
<h2>2. 블록 분리 사용</h2>
수집 - 전처리 - 학습 - 평가 - 추론이라는 파이프라인 순서로 블록이
실행되고 있지만, 꼭 해당 블록이 다 있어야만 되는 것은 아닙니다.
모델을 평가하지 않고 추론을 할 수 있으며, 모델 학습까지 수행해서
모델만 저장할 수 있습니다. <br />
(예시)
<br /> 1- 2- 3- 4- 5
<br /> 1- 2- 3- 4- 5
<br /> 1- 2- 3- 4- 5
<br />
<br />
이미지
<br />
<br /> */

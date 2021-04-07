import PropTypes from "prop-types";
import React from "react";
import { useDispatch } from "react-redux";
import { setModalPage } from "../../../actions/index";

const TutorialModal1 = ({ open, close }) => {
  const dispatch = useDispatch();
  const nextModal = () => {
    dispatch(setModalPage(3));
    close();
  };
  const prevModal = () => {
    dispatch(setModalPage(1));
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
            FlaNET 홈페이지 튜토리얼
            <button className="close" onClick={closeModal}>
              &times;
            </button>
          </header>
          <main>
            <div className="main-title">
              <h1>
                FlaNET에 오신 것을 환영합니다.
                <br />
              </h1>
              <span className="h3-none">
                FlaNET은 머신 러닝에 관심이 있는 모두를 위한 블록 코딩
                서비스입니다!
                <br />
                튜토리얼을 통해 머신러닝을 학습해보아요!{" "}
                <img
                  src={`${process.env.PUBLIC_URL}/img/flanet_logo.png`}
                  className="tutorial-img-1-1"
                  alt="home_block"
                />
              </span>
            </div>
            <br />
            <h1 className="main-title">FlaNET</h1>
            <img
              src={`${process.env.PUBLIC_URL}/img/tutorial_1_1.png`}
              className="tutorial-img-1-1"
              alt="home_block"
            />
            <br />
            <br />
            <div className="main-title h3-none"></div>
            <br />

            <div className="main-title">
              <h1>
                1. 블록코딩을 위한 Workspace!
                <br />
              </h1>
            </div>
            <div className="main-title h3-none">
              FlaNET에서는 누구나 쉽게 블록으로 코딩할 수 있도록 Workspace를
              지원하고 있어요!
              <br />
              블록 코딩을 통해 나만의 모델을 만들며 학습을 해봅시다!
            </div>
            <br />
            <img
              src={`${process.env.PUBLIC_URL}/img/tutorial_1_2.png`}
              className="tutorial-img-1-3"
              alt="home_block"
            />
            <br />
            <br />
            <br />

            <div className="main-title">
              <h1>
                2. 학습 결과를 확인할 수 있는 그래프!
                <br />
              </h1>
            </div>

            <div className="main-title h3-none">
              학습을 했으면 결과를 확인해야겠죠? <br />
              학습된 결과가 데이터, 그래프, 그리고 내가 짠 블록의 코드로
              제공됩니다!
            </div>
            <br />

            <img
              src={`${process.env.PUBLIC_URL}/img/tutorial_1_3.PNG`}
              className="tutorial-img-1-1"
              alt="home_block"
            />
            <br />
            <br />
            <br />

            <div className="main-title">
              <h1>
                3. 다양한 FlaNET 서비스! <br />
              </h1>
            </div>
            <div className="main-title h3-none">
              {" "}
              수집 데이터부터 분석, 예측 데이터, 그리고 내가 만든 딥러닝
              모델까지!
              <br />
              마이페이지에서 진행한 내용을 확인하고 사용해보세요!
            </div>
            <br />

            <img
              src={`${process.env.PUBLIC_URL}/img/tutorial_1_4.PNG`}
              className="tutorial-img-1-1"
              alt="home_block"
            />
            <br />
            <br />
            <div className="main-title">
              <h3> 다음 장부터 블록 코딩하는 방법을 배워봐요!</h3>{" "}
            </div>
          </main>
          <footer>
            <span className="foot-number">2 / 5</span>
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

TutorialModal1.propTypes = {
  open: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
};

export default TutorialModal1;

// 과거 수집 데이터와분석. ~ 내가 만든 모델 블록 코딩을 저장하고 다시 불러올 수 있는 기능까지!
// 상단 바에 있는 mypage를 통해 ~~ 확인할 수 있습니다.
// mypage를 통해 사용자의 ~~ 를 볼 수 있습니다.
//   mypage와  ~~
//       MyPage에서는 ~~을 볼수 있습니다! 볼수 있으며, 지금까지 작업한 화면을 확인할 ㅅ ㅜ있ㅇ요!
//       이름 변경 및 학습 모델 등 확인

import { useState } from "react";

const FaqSection = () => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const handleTabClick = (index) => {
    setActiveTabIndex(index);
  };

  const [imgTab, setImgTab] = useState(0);

  return (
    <section className="faq-section fix section-padding">
      <div className="container">
        <div className="faq-wrapper">
          <div className="row g-4">
            <div className="col-lg-3">
              <div className="faq-left">
                <ul className="nav" role="tablist">
                  <li className="nav-item" role="presentation">
                    <a
                      className={`nav-link ${
                        activeTabIndex === 0 ? " active" : ""
                      }`}
                      onClick={() => handleTabClick(0)}
                    >
                      Trust & Safety
                    </a>
                  </li>
                  <li className="nav-item" role="presentation">
                    <a
                      className={`nav-link ${
                        activeTabIndex === 1 ? " active" : ""
                      }`}
                      onClick={() => handleTabClick(1)}
                    >
                      General
                    </a>
                  </li>
                  <li className="nav-item" role="presentation">
                    <a
                      className={`nav-link ${
                        activeTabIndex === 2 ? " active" : ""
                      }`}
                      onClick={() => handleTabClick(2)}
                    >
                      Programs
                    </a>
                  </li>
                  <li className="nav-item" role="presentation">
                    <a
                      className={`nav-link ${
                        activeTabIndex === 3 ? " active" : ""
                      }`}
                      onClick={() => handleTabClick(3)}
                    >
                      Kindergarten
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-9">
              <div className="tab-content">
                <div
                  id="trust"
                  className={`c-tab-single ${
                    activeTabIndex === 0 ? "active-tab" : ""
                  }`}
                  role="tabpanel"
                >
                  <div className="faq-content">
                    <div className="faq-accordion">
                      <div className="accordion" id="accordion">
                        <div className="accordion-item mb-3">
                          <h5 className="accordion-header">
                            <button
                              className={
                                (imgTab == 0 ? "  " : " collapsed") +
                                " accordion-button"
                              }
                              onClick={() => setImgTab(imgTab === 0 ? -1 : 0)}
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target="#faq1"
                              aria-expanded="true"
                              aria-controls="faq1"
                            >
                              What skills will my child learn by using kinder?
                            </button>
                          </h5>
                          <div
                            id="faq1"
                            className={`accordion-collapse collapse${
                              imgTab === 0 ? " show " : ""
                            }`}
                            data-bs-parent="#accordion"
                          >
                            <div className="accordion-body">
                              Nulla facilisi. Vestibulum tristique sem in eros
                              eleifend imperdiet. Donec quis convallis neque. In
                              id lacus pulvinar lacus, eget vulputate lectus. Ut
                              viverra bibendum lorem, at tempus nibh mattis in
                              massa eget lacus consequat auctor.
                            </div>
                          </div>
                        </div>
                        <div className="accordion-item mb-3">
                          <h5 className="accordion-header">
                            <button
                              className={
                                (imgTab == 2 ? "  " : " collapsed") +
                                " accordion-button"
                              }
                              onClick={() => setImgTab(imgTab === 2 ? -1 : 2)}
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target="#faq2"
                              aria-expanded="false"
                              aria-controls="faq2"
                            >
                              What is included in your services?
                            </button>
                          </h5>
                          <div
                            id="faq2"
                            className={`accordion-collapse collapse${
                              imgTab === 2 ? " show " : ""
                            }`}
                            data-bs-parent="#accordion"
                          >
                            <div className="accordion-body">
                              Nulla facilisi. Vestibulum tristique sem in eros
                              eleifend imperdiet. Donec quis convallis neque. In
                              id lacus pulvinar lacus, eget vulputate lectus. Ut
                              viverra bibendum lorem, at tempus nibh mattis in
                              massa eget lacus consequat auctor.
                            </div>
                          </div>
                        </div>
                        <div className="accordion-item mb-3">
                          <h5 className="accordion-header">
                            <button
                              className={
                                (imgTab == 3 ? "  " : " collapsed") +
                                " accordion-button"
                              }
                              onClick={() => setImgTab(imgTab === 3 ? -1 : 3)}
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target="#faq3"
                              aria-expanded="false"
                              aria-controls="faq3"
                            >
                              What type of company is measured?
                            </button>
                          </h5>
                          <div
                            id="faq3"
                            className={`accordion-collapse collapse${
                              imgTab === 3 ? " show " : ""
                            }`}
                            data-bs-parent="#accordion"
                          >
                            <div className="accordion-body">
                              Nulla facilisi. Vestibulum tristique sem in eros
                              eleifend imperdiet. Donec quis convallis neque. In
                              id lacus pulvinar lacus, eget vulputate lectus. Ut
                              viverra bibendum lorem, at tempus nibh mattis in
                              massa eget lacus consequat auctor.
                            </div>
                          </div>
                        </div>
                        <div className="accordion-item mb-3">
                          <h5 className="accordion-header">
                            <button
                              className={
                                (imgTab == 4 ? "  " : " collapsed") +
                                " accordion-button"
                              }
                              onClick={() => setImgTab(imgTab === 4 ? -1 : 4)}
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target="#faq4"
                              aria-expanded="false"
                              aria-controls="faq4"
                            >
                              Are the tours included with meals?
                            </button>
                          </h5>
                          <div
                            id="faq4"
                            className={`accordion-collapse collapse${
                              imgTab === 4 ? " show " : ""
                            }`}
                            data-bs-parent="#accordion"
                          >
                            <div className="accordion-body">
                              Nulla facilisi. Vestibulum tristique sem in eros
                              eleifend imperdiet. Donec quis convallis neque. In
                              id lacus pulvinar lacus, eget vulputate lectus. Ut
                              viverra bibendum lorem, at tempus nibh mattis in
                              massa eget lacus consequat auctor.
                            </div>
                          </div>
                        </div>
                        <div className="accordion-item mb-3">
                          <h5 className="accordion-header">
                            <button
                              className={
                                (imgTab == 5 ? "  " : " collapsed") +
                                " accordion-button"
                              }
                              onClick={() => setImgTab(imgTab === 5 ? -1 : 5)}
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target="#faq5"
                              aria-expanded="false"
                              aria-controls="faq5"
                            >
                              What Activities are Done in the Development?
                            </button>
                          </h5>
                          <div
                            id="faq5"
                            className={`accordion-collapse collapse${
                              imgTab === 5 ? " show " : ""
                            }`}
                            data-bs-parent="#accordion"
                          >
                            <div className="accordion-body">
                              Nulla facilisi. Vestibulum tristique sem in eros
                              eleifend imperdiet. Donec quis convallis neque. In
                              id lacus pulvinar lacus, eget vulputate lectus. Ut
                              viverra bibendum lorem, at tempus nibh mattis in
                              massa eget lacus consequat auctor.
                            </div>
                          </div>
                        </div>
                        <div className="accordion-item">
                          <h5 className="accordion-header">
                            <button
                              className={
                                (imgTab == 6 ? "  " : " collapsed") +
                                " accordion-button"
                              }
                              onClick={() => setImgTab(imgTab === 6 ? -1 : 6)}
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target="#faq6"
                              aria-expanded="false"
                              aria-controls="faq6"
                            >
                              What ages is Prodigies designed for?
                            </button>
                          </h5>
                          <div
                            id="faq6"
                            className={`accordion-collapse collapse${
                              imgTab === 6 ? " show " : ""
                            }`}
                            data-bs-parent="#accordion"
                          >
                            <div className="accordion-body">
                              Nulla facilisi. Vestibulum tristique sem in eros
                              eleifend imperdiet. Donec quis convallis neque. In
                              id lacus pulvinar lacus, eget vulputate lectus. Ut
                              viverra bibendum lorem, at tempus nibh mattis in
                              massa eget lacus consequat auctor.
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  id="general"
                  className={`c-tab-single ${
                    activeTabIndex === 1 ? "active-tab" : ""
                  }`}
                >
                  <div className="faq-content">
                    <div className="faq-accordion">
                      <div className="accordion" id="accordion2">
                        <div className="accordion-item mb-3">
                          <h5 className="accordion-header">
                            <button
                              className={
                                (imgTab == 7 ? "  " : " collapsed") +
                                " accordion-button"
                              }
                              onClick={() => setImgTab(imgTab === 7 ? -1 : 7)}
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target="#faq11"
                              aria-expanded="true"
                              aria-controls="faq11"
                            >
                              What skills will my child learn by using kinder?
                            </button>
                          </h5>
                          <div
                            id="faq11"
                            className={`accordion-collapse collapse${
                              imgTab === 7 ? " show " : ""
                            }`}
                            data-bs-parent="#accordion"
                          >
                            <div className="accordion-body">
                              Nulla facilisi. Vestibulum tristique sem in eros
                              eleifend imperdiet. Donec quis convallis neque. In
                              id lacus pulvinar lacus, eget vulputate lectus. Ut
                              viverra bibendum lorem, at tempus nibh mattis in
                              massa eget lacus consequat auctor.
                            </div>
                          </div>
                        </div>
                        <div className="accordion-item mb-3">
                          <h5 className="accordion-header">
                            <button
                              className={
                                (imgTab == 8 ? "  " : " collapsed") +
                                " accordion-button"
                              }
                              onClick={() => setImgTab(imgTab === 8 ? -1 : 8)}
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target="#faq22"
                              aria-expanded="false"
                              aria-controls="faq22"
                            >
                              What is included in your services?
                            </button>
                          </h5>
                          <div
                            id="faq22"
                            className={`accordion-collapse collapse${
                              imgTab === 8 ? " show " : ""
                            }`}
                            data-bs-parent="#accordion"
                          >
                            <div className="accordion-body">
                              Nulla facilisi. Vestibulum tristique sem in eros
                              eleifend imperdiet. Donec quis convallis neque. In
                              id lacus pulvinar lacus, eget vulputate lectus. Ut
                              viverra bibendum lorem, at tempus nibh mattis in
                              massa eget lacus consequat auctor.
                            </div>
                          </div>
                        </div>
                        <div className="accordion-item mb-3">
                          <h5 className="accordion-header">
                            <button
                              className={
                                (imgTab == 9 ? "  " : " collapsed") +
                                " accordion-button"
                              }
                              onClick={() => setImgTab(imgTab === 9 ? -1 : 9)}
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target="#faq33"
                              aria-expanded="false"
                              aria-controls="faq33"
                            >
                              What type of company is measured?
                            </button>
                          </h5>
                          <div
                            id="faq33"
                            className={`accordion-collapse collapse${
                              imgTab === 9 ? " show " : ""
                            }`}
                            data-bs-parent="#accordion"
                          >
                            <div className="accordion-body">
                              Nulla facilisi. Vestibulum tristique sem in eros
                              eleifend imperdiet. Donec quis convallis neque. In
                              id lacus pulvinar lacus, eget vulputate lectus. Ut
                              viverra bibendum lorem, at tempus nibh mattis in
                              massa eget lacus consequat auctor.
                            </div>
                          </div>
                        </div>
                        <div className="accordion-item mb-3">
                          <h5 className="accordion-header">
                            <button
                              className={
                                (imgTab == 10 ? "  " : " collapsed") +
                                " accordion-button"
                              }
                              onClick={() => setImgTab(imgTab === 10 ? -1 : 10)}
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target="#faq44"
                              aria-expanded="false"
                              aria-controls="faq44"
                            >
                              Are the tours included with meals?
                            </button>
                          </h5>
                          <div
                            id="faq44"
                            className={`accordion-collapse collapse${
                              imgTab === 10 ? " show " : ""
                            }`}
                            data-bs-parent="#accordion"
                          >
                            <div className="accordion-body">
                              Nulla facilisi. Vestibulum tristique sem in eros
                              eleifend imperdiet. Donec quis convallis neque. In
                              id lacus pulvinar lacus, eget vulputate lectus. Ut
                              viverra bibendum lorem, at tempus nibh mattis in
                              massa eget lacus consequat auctor.
                            </div>
                          </div>
                        </div>
                        <div className="accordion-item mb-3">
                          <h5 className="accordion-header">
                            <button
                              className={
                                (imgTab == 11 ? "  " : " collapsed") +
                                " accordion-button"
                              }
                              onClick={() => setImgTab(imgTab === 11 ? -1 : 11)}
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target="#faq55"
                              aria-expanded="false"
                              aria-controls="faq55"
                            >
                              What Activities are Done in the Development?
                            </button>
                          </h5>
                          <div
                            id="faq55"
                            className={`accordion-collapse collapse${
                              imgTab === 11 ? " show " : ""
                            }`}
                            data-bs-parent="#accordion"
                          >
                            <div className="accordion-body">
                              Nulla facilisi. Vestibulum tristique sem in eros
                              eleifend imperdiet. Donec quis convallis neque. In
                              id lacus pulvinar lacus, eget vulputate lectus. Ut
                              viverra bibendum lorem, at tempus nibh mattis in
                              massa eget lacus consequat auctor.
                            </div>
                          </div>
                        </div>
                        <div className="accordion-item">
                          <h5 className="accordion-header">
                            <button
                              className={
                                (imgTab == 12 ? "  " : " collapsed") +
                                " accordion-button"
                              }
                              onClick={() => setImgTab(imgTab === 12 ? -1 : 12)}
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target="#faq66"
                              aria-expanded="false"
                              aria-controls="faq66"
                            >
                              What ages is Prodigies designed for?
                            </button>
                          </h5>
                          <div
                            id="faq66"
                            className={`accordion-collapse collapse${
                              imgTab === 12 ? " show " : ""
                            }`}
                            data-bs-parent="#accordion"
                          >
                            <div className="accordion-body">
                              Nulla facilisi. Vestibulum tristique sem in eros
                              eleifend imperdiet. Donec quis convallis neque. In
                              id lacus pulvinar lacus, eget vulputate lectus. Ut
                              viverra bibendum lorem, at tempus nibh mattis in
                              massa eget lacus consequat auctor.
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  id="programs"
                  className={`c-tab-single ${
                    activeTabIndex === 2 ? "active-tab" : ""
                  }`}
                >
                  <div className="faq-content">
                    <div className="faq-accordion">
                      <div className="accordion" id="accordion3">
                        <div className="accordion-item mb-3">
                          <h5 className="accordion-header">
                            <button
                              className={
                                (imgTab == 13 ? "  " : " collapsed") +
                                " accordion-button"
                              }
                              onClick={() => setImgTab(imgTab === 13 ? -1 : 13)}
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target="#faq111"
                              aria-expanded="true"
                              aria-controls="faq111"
                            >
                              What skills will my child learn by using kinder?
                            </button>
                          </h5>
                          <div
                            id="faq111"
                            className={`accordion-collapse collapse${
                              imgTab === 13 ? " show " : ""
                            }`}
                            data-bs-parent="#accordion"
                          >
                            <div className="accordion-body">
                              Nulla facilisi. Vestibulum tristique sem in eros
                              eleifend imperdiet. Donec quis convallis neque. In
                              id lacus pulvinar lacus, eget vulputate lectus. Ut
                              viverra bibendum lorem, at tempus nibh mattis in
                              massa eget lacus consequat auctor.
                            </div>
                          </div>
                        </div>
                        <div className="accordion-item mb-3">
                          <h5 className="accordion-header">
                            <button
                              className={
                                (imgTab == 14 ? "  " : " collapsed") +
                                " accordion-button"
                              }
                              onClick={() => setImgTab(imgTab === 14 ? -1 : 14)}
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target="#faq222"
                              aria-expanded="false"
                              aria-controls="faq222"
                            >
                              What is included in your services?
                            </button>
                          </h5>
                          <div
                            id="faq222"
                            className={`accordion-collapse collapse${
                              imgTab === 14 ? " show " : ""
                            }`}
                            data-bs-parent="#accordion"
                          >
                            <div className="accordion-body">
                              Nulla facilisi. Vestibulum tristique sem in eros
                              eleifend imperdiet. Donec quis convallis neque. In
                              id lacus pulvinar lacus, eget vulputate lectus. Ut
                              viverra bibendum lorem, at tempus nibh mattis in
                              massa eget lacus consequat auctor.
                            </div>
                          </div>
                        </div>
                        <div className="accordion-item mb-3">
                          <h5 className="accordion-header">
                            <button
                              className={
                                (imgTab == 15 ? "  " : " collapsed") +
                                " accordion-button"
                              }
                              onClick={() => setImgTab(imgTab === 15 ? -1 : 15)}
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target="#faq333"
                              aria-expanded="false"
                              aria-controls="faq333"
                            >
                              What type of company is measured?
                            </button>
                          </h5>
                          <div
                            id="faq333"
                            className={`accordion-collapse collapse${
                              imgTab === 15 ? " show " : ""
                            }`}
                            data-bs-parent="#accordion"
                          >
                            <div className="accordion-body">
                              Nulla facilisi. Vestibulum tristique sem in eros
                              eleifend imperdiet. Donec quis convallis neque. In
                              id lacus pulvinar lacus, eget vulputate lectus. Ut
                              viverra bibendum lorem, at tempus nibh mattis in
                              massa eget lacus consequat auctor.
                            </div>
                          </div>
                        </div>
                        <div className="accordion-item mb-3">
                          <h5 className="accordion-header">
                            <button
                              className={
                                (imgTab == 16 ? "  " : " collapsed") +
                                " accordion-button"
                              }
                              onClick={() => setImgTab(imgTab === 16 ? -1 : 16)}
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target="#faq444"
                              aria-expanded="false"
                              aria-controls="faq444"
                            >
                              Are the tours included with meals?
                            </button>
                          </h5>
                          <div
                            id="faq444"
                            className={`accordion-collapse collapse${
                              imgTab === 16 ? " show " : ""
                            }`}
                            data-bs-parent="#accordion"
                          >
                            <div className="accordion-body">
                              Nulla facilisi. Vestibulum tristique sem in eros
                              eleifend imperdiet. Donec quis convallis neque. In
                              id lacus pulvinar lacus, eget vulputate lectus. Ut
                              viverra bibendum lorem, at tempus nibh mattis in
                              massa eget lacus consequat auctor.
                            </div>
                          </div>
                        </div>
                        <div className="accordion-item mb-3">
                          <h5 className="accordion-header">
                            <button
                              className={
                                (imgTab == 17 ? "  " : " collapsed") +
                                " accordion-button"
                              }
                              onClick={() => setImgTab(imgTab === 17 ? -1 : 17)}
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target="#faq555"
                              aria-expanded="false"
                              aria-controls="faq555"
                            >
                              What Activities are Done in the Development?
                            </button>
                          </h5>
                          <div
                            id="faq555"
                            className={`accordion-collapse collapse${
                              imgTab === 17 ? " show " : ""
                            }`}
                            data-bs-parent="#accordion"
                          >
                            <div className="accordion-body">
                              Nulla facilisi. Vestibulum tristique sem in eros
                              eleifend imperdiet. Donec quis convallis neque. In
                              id lacus pulvinar lacus, eget vulputate lectus. Ut
                              viverra bibendum lorem, at tempus nibh mattis in
                              massa eget lacus consequat auctor.
                            </div>
                          </div>
                        </div>
                        <div className="accordion-item">
                          <h5 className="accordion-header">
                            <button
                              className={
                                (imgTab == 18 ? "  " : " collapsed") +
                                " accordion-button"
                              }
                              onClick={() => setImgTab(imgTab === 18 ? -1 : 18)}
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target="#faq666"
                              aria-expanded="false"
                              aria-controls="faq666"
                            >
                              What ages is Prodigies designed for?
                            </button>
                          </h5>
                          <div
                            id="faq666"
                            className={`accordion-collapse collapse${
                              imgTab === 18 ? " show " : ""
                            }`}
                            data-bs-parent="#accordion"
                          >
                            <div className="accordion-body">
                              Nulla facilisi. Vestibulum tristique sem in eros
                              eleifend imperdiet. Donec quis convallis neque. In
                              id lacus pulvinar lacus, eget vulputate lectus. Ut
                              viverra bibendum lorem, at tempus nibh mattis in
                              massa eget lacus consequat auctor.
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  id="kindergarten"
                  className={`c-tab-single ${
                    activeTabIndex === 3 ? "active-tab" : ""
                  }`}
                >
                  <div className="faq-content">
                    <div className="faq-accordion">
                      <div className="accordion" id="accordion4">
                        <div className="accordion-item mb-3">
                          <h5 className="accordion-header">
                            <button
                              className={
                                (imgTab == 19 ? "  " : " collapsed") +
                                " accordion-button"
                              }
                              onClick={() => setImgTab(imgTab === 19 ? -1 : 19)}
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target="#faq1111"
                              aria-expanded="true"
                              aria-controls="faq1111"
                            >
                              What skills will my child learn by using kinder?
                            </button>
                          </h5>
                          <div
                            id="faq1111"
                            className={`accordion-collapse collapse${
                              imgTab === 19 ? " show " : ""
                            }`}
                            data-bs-parent="#accordion"
                          >
                            <div className="accordion-body">
                              Nulla facilisi. Vestibulum tristique sem in eros
                              eleifend imperdiet. Donec quis convallis neque. In
                              id lacus pulvinar lacus, eget vulputate lectus. Ut
                              viverra bibendum lorem, at tempus nibh mattis in
                              massa eget lacus consequat auctor.
                            </div>
                          </div>
                        </div>
                        <div className="accordion-item mb-3">
                          <h5 className="accordion-header">
                            <button
                              className={
                                (imgTab == 20 ? "  " : " collapsed") +
                                " accordion-button"
                              }
                              onClick={() => setImgTab(imgTab === 20 ? -1 : 20)}
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target="#faq2222"
                              aria-expanded="false"
                              aria-controls="faq2222"
                            >
                              What is included in your services?
                            </button>
                          </h5>
                          <div
                            id="faq2222"
                            className={`accordion-collapse collapse${
                              imgTab === 20 ? " show " : ""
                            }`}
                            data-bs-parent="#accordion"
                          >
                            <div className="accordion-body">
                              Nulla facilisi. Vestibulum tristique sem in eros
                              eleifend imperdiet. Donec quis convallis neque. In
                              id lacus pulvinar lacus, eget vulputate lectus. Ut
                              viverra bibendum lorem, at tempus nibh mattis in
                              massa eget lacus consequat auctor.
                            </div>
                          </div>
                        </div>
                        <div className="accordion-item mb-3">
                          <h5 className="accordion-header">
                            <button
                              className={
                                (imgTab == 21 ? "  " : " collapsed") +
                                " accordion-button"
                              }
                              onClick={() => setImgTab(imgTab === 21 ? -1 : 21)}
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target="#faq3333"
                              aria-expanded="false"
                              aria-controls="faq3333"
                            >
                              What type of company is measured?
                            </button>
                          </h5>
                          <div
                            id="faq3333"
                            className={`accordion-collapse collapse${
                              imgTab === 21 ? " show " : ""
                            }`}
                            data-bs-parent="#accordion"
                          >
                            <div className="accordion-body">
                              Nulla facilisi. Vestibulum tristique sem in eros
                              eleifend imperdiet. Donec quis convallis neque. In
                              id lacus pulvinar lacus, eget vulputate lectus. Ut
                              viverra bibendum lorem, at tempus nibh mattis in
                              massa eget lacus consequat auctor.
                            </div>
                          </div>
                        </div>
                        <div className="accordion-item mb-3">
                          <h5 className="accordion-header">
                            <button
                              className={
                                (imgTab == 22 ? "  " : " collapsed") +
                                " accordion-button"
                              }
                              onClick={() => setImgTab(imgTab === 22 ? -1 : 22)}
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target="#faq4444"
                              aria-expanded="false"
                              aria-controls="faq4444"
                            >
                              Are the tours included with meals?
                            </button>
                          </h5>
                          <div
                            id="faq4444"
                            className={`accordion-collapse collapse${
                              imgTab === 22 ? " show " : ""
                            }`}
                            data-bs-parent="#accordion"
                          >
                            <div className="accordion-body">
                              Nulla facilisi. Vestibulum tristique sem in eros
                              eleifend imperdiet. Donec quis convallis neque. In
                              id lacus pulvinar lacus, eget vulputate lectus. Ut
                              viverra bibendum lorem, at tempus nibh mattis in
                              massa eget lacus consequat auctor.
                            </div>
                          </div>
                        </div>
                        <div className="accordion-item mb-3">
                          <h5 className="accordion-header">
                            <button
                              className={
                                (imgTab == 23 ? "  " : " collapsed") +
                                " accordion-button"
                              }
                              onClick={() => setImgTab(imgTab === 23 ? -1 : 23)}
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target="#faq5555"
                              aria-expanded="false"
                              aria-controls="faq5555"
                            >
                              What Activities are Done in the Development?
                            </button>
                          </h5>
                          <div
                            id="faq5555"
                            className={`accordion-collapse collapse${
                              imgTab === 23 ? " show " : ""
                            }`}
                            data-bs-parent="#accordion"
                          >
                            <div className="accordion-body">
                              Nulla facilisi. Vestibulum tristique sem in eros
                              eleifend imperdiet. Donec quis convallis neque. In
                              id lacus pulvinar lacus, eget vulputate lectus. Ut
                              viverra bibendum lorem, at tempus nibh mattis in
                              massa eget lacus consequat auctor.
                            </div>
                          </div>
                        </div>
                        <div className="accordion-item">
                          <h5 className="accordion-header">
                            <button
                              className={
                                (imgTab == 24 ? "  " : " collapsed") +
                                " accordion-button"
                              }
                              onClick={() => setImgTab(imgTab === 0 ? -1 : 24)}
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target="#faq6666"
                              aria-expanded="false"
                              aria-controls="faq6666"
                            >
                              What ages is Prodigies designed for?
                            </button>
                          </h5>
                          <div
                            id="faq6666"
                            className={`accordion-collapse collapse${
                              imgTab === 24 ? " show " : ""
                            }`}
                            data-bs-parent="#accordion"
                          >
                            <div className="accordion-body">
                              Nulla facilisi. Vestibulum tristique sem in eros
                              eleifend imperdiet. Donec quis convallis neque. In
                              id lacus pulvinar lacus, eget vulputate lectus. Ut
                              viverra bibendum lorem, at tempus nibh mattis in
                              massa eget lacus consequat auctor.
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;

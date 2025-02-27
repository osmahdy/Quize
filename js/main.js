let numberOfQuestions = document.querySelector('.quize .top .questionNum span');
let questionNumberSerries = document.querySelector(
  '.quize .btns .question_number .all'
);
let currentQuestionNumber = document.querySelector(
  '.quize .btns .question_number .current'
);
let QuestionsTags = document.querySelector('.tags');
let QuestionsTagsSpans = document.querySelectorAll('.tags span');
let centerArea = document.querySelector('.quize .center');
let bottomSection = document.querySelector('.quize .btns');
let RetrySection = document.querySelector('.quize .retry_section');
let retrybtn = document.querySelector('.quize .retry_section .retry_btn');
let nextbtn = document.querySelector('.quize .btns .next');
let backbtn = document.querySelector('.quize .btns .back');
let questionTitle = document.querySelector('.quize .center h3');
let label = document.querySelectorAll(`.quize .center label`);
let finalResult = document.querySelector('.quize .final_result');
let statusSentence = document.querySelector('.quize .final_result .status');
let finalMark = document.querySelector('.quize .final_result .mark');
let timer = document.querySelector(`.quize .top .timer`);
let minutes = document.querySelector(`.quize .top .minutes`);
let secounds = document.querySelector(`.quize .top .secounds`);
let result = 0;
let currentIndex = 0;
let numberOfAnswrs = 4;
currentQuestionNumber.textContent = 1;
let countDownInterval;
getQuestions();
function getQuestions() {
  let myRequest = new XMLHttpRequest();
  myRequest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let questionsObjuct = JSON.parse(this.responseText);
      let qcount = questionsObjuct.length;
      //add the number of questions to the top and bottom in the question element
      numberOfQuestions.textContent = qcount;
      questionNumberSerries.textContent = qcount;
      //create tags of questions as same as the number of questions added
      createQuestionsTags(qcount);
      //show the first question
      addQuestionsData(questionsObjuct[currentIndex], qcount);
      countdown(questionsObjuct[currentIndex], qcount);
      //when clicking next button
      nextbtn.onclick = () => {
        backbtn.classList.remove('disabled');
        checkResult(questionsObjuct[currentIndex].right_answer, qcount);
        currentIndex++;
        centerArea.innerHTML = '';
        if (currentIndex <= qcount - 1) {
          addQuestionsData(questionsObjuct[currentIndex], qcount);
          currentQuestionNumber.textContent = currentIndex + 1;
          moveTags(currentIndex);
        } else {
          showFinalResult(qcount);
        }
        if (currentIndex === qcount - 1) {
          nextbtn.textContent = 'Submit';
          nextbtn.classList.add('disabled');
        } else if (currentIndex === qcount) {
          bottomSection.style.display = 'none';
          RetrySection.style.display = 'flex';
        }
      };
      //when clicking back button
      backbtn.onclick = () => {
        if (currentIndex > 0) {
          centerArea.innerHTML = '';
          currentIndex--;
          addQuestionsData(questionsObjuct[currentIndex], qcount);
          currentQuestionNumber.textContent = currentIndex + 1;
          moveTags(currentIndex);
          if (currentIndex === 0) {
            backbtn.classList.add('disabled');
          }
          if (currentIndex !== qcount - 1) {
            nextbtn.textContent = 'Next';
          }
          if (currentIndex < qcount) {
            nextbtn.classList.remove('disabled');
          }
        }
        checkResult(questionsObjuct[currentIndex].right_answer, qcount);
      };
      //when clicking the retry btn
      retrybtn.onclick = () => {
        clearInterval(countDownInterval);
        RetrySection.style.display = 'none';
        finalResult.style.display = 'none';
        bottomSection.style.display = 'flex';
        currentIndex = 0;
        result = 0;
        currentQuestionNumber.textContent = currentIndex + 1;
        refreshAnswerArray();
        addQuestionsData(questionsObjuct[currentIndex], qcount);
        moveTags(currentIndex);
        nextbtn.textContent = 'Next';
        if (currentIndex === qcount - 1) {
          nextbtn.textContent = 'Submit';
        }
        countdown(questionsObjuct[currentIndex], qcount);
      };
      //when clicking question number in tags
      clickTags(questionsObjuct, qcount);
    }
  };
  myRequest.open('GET', 'questions.json', true);
  myRequest.send();
}

//create side question tags
function createQuestionsTags(qnum) {
  for (let i = 1; i <= qnum; i++) {
    let questionsNumbers = document.createElement('span');
    questionsNumbers.textContent = i;
    //add active class to the first question tag
    if (i === 1) {
      questionsNumbers.classList.add('active');
    }
    QuestionsTags.appendChild(questionsNumbers);
  }
}

//to move the active class from the tags according to the questions number
function moveTags(index) {
  let QuestionsTagsSpans = document.querySelectorAll('.tags span');
  QuestionsTagsSpans.forEach((span) => {
    span.classList.remove('active');
    if (span.textContent === QuestionsTagsSpans[index].textContent) {
      span.classList.add('active');
    }
  });
}

function clickTags(obj, qcount) {
  let QuestionsTagsSpans = document.querySelectorAll('.tags span');
  QuestionsTagsSpans.forEach((span) => {
    span.onclick = () => {
      centerArea.innerHTML = '';
      currentIndex = span.textContent - 1;
      addQuestionsData(obj[currentIndex], qcount);
      getAnswersFromArray(); // Restore previous answer selection
      currentQuestionNumber.textContent = currentIndex + 1;
      moveTags(currentIndex);
      checkResult(obj[currentIndex].right_answer, qcount);

      if (currentIndex === 0) {
        backbtn.classList.add('disabled');
      } else {
        backbtn.classList.remove('disabled');
      }
      if (currentIndex < qcount - 1) {
        nextbtn.textContent = 'Next';
        nextbtn.classList.remove('disabled');
      } else if (currentIndex === qcount - 1) {
        nextbtn.textContent = 'Submit';
        nextbtn.classList.add('disabled');
      }
    };
  });
}

//function to retrive the questions data from the json file
function addQuestionsData(obj) {
  //create the html elements
  //crete the h3
  let questionTitle = document.createElement('h3');
  questionTitle.textContent = obj['title'];
  centerArea.appendChild(questionTitle);
  for (let i = 1; i <= numberOfAnswrs; i++) {
    let answer = document.createElement('div');
    let radioInput = document.createElement('input');
    let label = document.createElement('label');
    //add the attrebutes (class, type, id, name,data-answer, for) to the created elements
    answer.className = 'answer';
    radioInput.type = 'radio';
    radioInput.name = 'answer';
    radioInput.id = `answer_${i}`;
    radioInput.dataset.answer = obj[`answer_${i}`];
    label.htmlFor = `answer_${i}`;
    label.className = `label${i}`;

    //add the answers to the labels
    label.textContent = obj[`answer_${i}`];

    //append childes
    centerArea.appendChild(answer);
    answer.appendChild(radioInput);
    answer.appendChild(label);
  }
  //make thew first answer checked
  getAnswersFromArray();
}

function checkResult(right_answer, qcount) {
  for (let i = 1; i <= numberOfAnswrs; i++) {
    let input = document.getElementById(`answer_${i}`);
    let label = document.querySelector(`.label${i}`);
    if (input.checked) {
      saveAnswerToArray(qcount, currentIndex, label.textContent);
      if (label.textContent === right_answer) {
        result++;
      }
    }
  }
}

let answers = [];
function saveAnswerToArray(qcount, qindex, answer) {
  if (answers.length <= qcount) {
    answers[qindex] = answer;
  }
}
function getAnswersFromArray() {
  for (let i = 0; i < numberOfAnswrs; i++) {
    let label = document.querySelector(`.quize .center .answer .label${i + 1}`);
    let input = document.getElementById(`answer_${i + 1}`);
    if (label.textContent === answers[currentIndex]) {
      input.checked = true;
    }
  }
}

function refreshAnswerArray() {
  answers = [];
}

function closeTheBackBtn() {
  if (currentIndex === 0) {
    backbtn.style.cursor = 'no-drop';
  } else {
    backbtn.style.cursor = 'pointer';
  }
}

function showFinalResult(qcount) {
  finalResult.style.display = 'flex';
  if (result < 0.25 * qcount) {
    statusSentence.textContent = 'So Bad !!';
  }
  if (result < 0.75 * qcount && result > 0.25 * qcount) { 
    statusSentence.textContent = 'Not Bad !!';
  }
  if (result > 0.75 * qcount) {
    statusSentence.textContent = 'Congratulations !!';
  }
  if (result === 0) {
    statusSentence.textContent = 'failed !!';
  }
  finalMark.textContent = `Yuor Result IS: ${result}/${qcount}`;
}

function countdown(obj, qcount) {
  let MTime, STime;
  let allTimeInSecounds = qcount * 30;
  countDownInterval = setInterval(() => {
    MTime = parseInt(allTimeInSecounds / 60);
    STime = parseInt(allTimeInSecounds % 60);
    minutes.textContent = MTime < 10 ? `0${MTime}` : MTime;
    secounds.textContent = STime < 10 ? `0${STime}` : STime;
    if (--allTimeInSecounds < 0) {
      clearInterval(countDownInterval);
      submitAndFinish(obj, qcount);
    }
  }, 1000);
}
function submitAndFinish(obj, qcount) {
  currentIndex = qcount - 1;
  showFinalResult(qcount);
  RetrySection.style.display = 'flex';
  finalResult.style.display = 'flex';
  bottomSection.style.display = 'none';
  centerArea.style.display = 'none';
  retrybtn.onclick = () => {
    countdown(obj, qcount);
    RetrySection.style.display = 'none';
    finalResult.style.display = 'none';
    bottomSection.style.display = 'flex';
    currentIndex = 0;
    currentQuestionNumber.textContent = currentIndex + 1;
    refreshAnswerArray();
    centerArea.innerHTML = '';
    centerArea.style.display = 'block';
    addQuestionsData(obj, qcount);
    moveTags(currentIndex);
    nextbtn.textContent = 'Next';
    if (currentIndex === qcount - 1) {
      nextbtn.textContent = 'Submit';
    }
  };
  // showFinalResult(qcount);
}

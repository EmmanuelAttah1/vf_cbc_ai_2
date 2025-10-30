const address = "https://vf-cbc-ai-server.onrender.com"

let selectedOption = "A"
let num_of_question = 10
const role = document.getElementById("role")
const setup = document.getElementById('setup')
const loading = document.getElementById("loading")
const difficulty = document.getElementById("difficulty")
const interview_type = document.getElementById("interview-type")
const start_btn = document.getElementById("start_btn")

const messages = document.getElementById("messages")
const user_input = document.getElementById("user_input")


const saveID=(id)=>{
    // key is visiola_cbc_ai_2
    localStorage.setItem("visiola_cbc_ai_2",id)
}


const generateId = () => {
    // generate a random string of length 4
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let id = ''
    for (let i = 0; i < 4; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    saveID(id)
    return id
}

const getID=()=>{
    const id = localStorage.getItem("visiola_cbc_ai_2")
    if (id === undefined){
        generateId()
    }

    return localStorage.getItem("visiola_cbc_ai_2")
}


// api requests
const sendMessage = (method,endpoint,data={}) => {
    data["id"] = getID()
    return new Promise((resolve, reject) => {
        fetch(`${address}/${endpoint}`, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(res => {
            if (!res.ok) {
                throw new Error(`http_${res.status}`)
            }
            return res.json()
        })
        .then(data => {
            resolve(data)
        })
        .catch(err => {
            // ensure callers get an Error object
            reject(err instanceof Error ? err : new Error(String(err)))
        })
    })
}


const setQuestionCount=(number)=>{
    const questions = document.getElementsByClassName("question")

    num_of_question = number
    let index = 0
    if(number === 10){
        index = 1
    }else if(number === 20 ){
        index = 2
    }else if(number === 30){
        index = 3
    }

    for (let i = 0; i < questions.length; i++) {
        const element = questions[i];
        if(i === index){
            element.className = "px-4 py-2 rounded-lg border border-primary text-primary bg-primary/10 dark:bg-primary/20 ring-2 ring-primary/50 question"
        }else{
            element.className = "px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-primary/10 dark:hover:bg-primary/20 focus:ring-2 focus:ring-primary/50 question"
        }
    }
}


const getQuizInfo=()=>{
    data = {
        role:role.value,
        difficulty:difficulty.value,
        question_type:interview_type.value,
        num_questions : num_of_question
    }

    setup.style.display = "none"
    loading.style.visibility = "visible"
    start_btn.style.display = "none"
    sendMessage("post","setup/",data)
    .then(res=>{
      console.log("recieved response ",res);
      location = "chat.html"
      localStorage.setItem("data",JSON.stringify(res))
    })
}


// chat

const setAIMessage=(message)=>{
    messages.insertAdjacentHTML('beforeend', `<div class="flex items-end gap-3">
                <div
                  class="bg-gray-200 dark:bg-gray-700 rounded-full w-10 h-10 flex-shrink-0 flex items-center justify-center">
                  <span
                    class="material-symbols-outlined text-primary">smart_toy</span>
                </div>
                <div class="flex flex-col gap-1 items-start">
                  <p
                    class="text-gray-500 dark:text-gray-400 text-sm font-medium">AI
                    Coach</p>
                  <div
                    class="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg rounded-bl-none px-4 py-3 max-w-lg">
                    <p>${message}</p>
                  </div>
                </div>
              </div>`)
}

const setLoadingState=()=>{
    messages.insertAdjacentHTML('beforeend', `<div class="flex items-end gap-3">
                <div
                  class="bg-gray-200 dark:bg-gray-700 rounded-full w-10 h-10 flex-shrink-0 flex items-center justify-center">
                  <span
                    class="material-symbols-outlined text-primary">smart_toy</span>
                </div>
                <div class="flex flex-col gap-1 items-start">
                  <p
                    class="text-gray-500 dark:text-gray-400 text-sm font-medium">AI
                    Coach is typing...</p>
                  <div
                    class="bg-gray-100 dark:bg-gray-700 rounded-lg rounded-bl-none px-4 py-3">
                    <div class="flex items-center space-x-1">
                      <div
                        class="w-2 h-2 bg-primary rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                      <div
                        class="w-2 h-2 bg-primary rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                      <div
                        class="w-2 h-2 bg-primary rounded-] animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>`)
}

const setHumanMessage=(message)=>{
    messages.insertAdjacentHTML('beforeend', `<div class="flex items-end gap-3 justify-end">
                <div class="flex flex-col gap-1 items-end">
                  <p
                    class="text-gray-500 dark:text-gray-400 text-sm font-medium">You</p>
                  <div
                    class="bg-primary text-white rounded-lg rounded-br-none px-4 py-3 max-w-lg">
                    <p>${message}</p>
                  </div>
                </div>
                <div
                  class="bg-gray-200 dark:bg-gray-700 rounded-full w-10 h-10 flex-shrink-0 flex items-center justify-center">
                  <span class="material-symbols-outlined">person</span>
                </div>
              </div>`)
}

const removeLastChild=()=>{
    const lastChild = messages.lastElementChild;
    if (lastChild) {
        messages.removeChild(lastChild);
    }
}


const selectInputType=(messageType)=>{
    switch (messageType) {
        case "coding":
            user_input.innerHTML = `<div class="bg-gray-900 rounded-lg p-4">
                <textarea
                  class="w-full h-32 bg-transparent text-white font-mono text-sm border-0 focus:ring-0 resize-none p-0"
                  placeholder="def reverse_string(s):
      # Your code here"></textarea>
              </div>`
            break;

        case "objective":
            user_input.innerHTML = `<div>
            <p
                class="text-gray-500 dark:text-gray-400 text-sm font-medium">Select
                Option</p>

              <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
              <button
                  onclick="selectOptions('A')"
                  class="question-option px-4 py-2 rounded-lg border border-primary text-primary bg-primary/10 dark:bg-primary/20 ring-2 ring-primary/50">A</button>
                <button
                  onclick="selectOptions('B')"
                  class="question-option px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-primary/10 dark:hover:bg-primary/20 focus:ring-2 focus:ring-primary/50">B</button>
                <button
                  onclick="selectOptions('C')"
                  class="question-option px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-primary/10 dark:hover:bg-primary/20 focus:ring-2 focus:ring-primary/50">C</button>
                <button
                  onclick="selectOptions('D')"
                  class="question-option px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-primary/10 dark:hover:bg-primary/20 focus:ring-2 focus:ring-primary/50">D</button>
              </div>
            </div>`
            break;
    
        default:
            user_input.innerHTML = `<div class="bg-gray-200 dark:bg-gray-700 rounded-lg p-4">
                <textarea
                  class="w-full h-12 bg-transparent text-white font-mono text-sm border-0 focus:ring-0 resize-none p-0"
                  placeholder="Type response"></textarea>
              </div>`
            break;
    }
}

const selectOptions=(option)=>{    
    const options = document.getElementsByClassName("question-option")

    selectedOption = option
    let index = 0
    
    if(option === "B"){
        index = 1
    }else if(option === "C" ){
        index = 2
    }else if(option === "D"){
        index = 3
    }
    

    for (let i = 0; i < options.length; i++) {
        const element = options[i];
        
        if(i === index){
            element.className = "px-4 py-2 rounded-lg border border-primary text-primary bg-primary/10 dark:bg-primary/20 ring-2 ring-primary/50 question-option"
        }else{
            element.className = "px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-primary/10 dark:hover:bg-primary/20 focus:ring-2 focus:ring-primary/50 question-option"
        }
    }
}

const submitResponse=()=>{
    const value = document.getElementsByTagName("textarea")[0]
    let user_response;
    let is_option = false

    if(value !== undefined){
        console.log(value);
        user_response = value.value
    }else{
        console.log("submitting option : ",selectedOption);
        user_response = selectedOption
        is_option = true
    }

    if(user_response.length > 0){

      if(is_option){
        setHumanMessage(`You selected ${user_response}`)
      }else{
        setHumanMessage(user_response)
      }

      setLoadingState()
      sendMessage("post","message/",{message:user_response})
      .then(res=>{
        removeLastChild()
        setAIMessage(res.ai_response)
        selectInputType(res.type)

        if(res.has_ended){
          setAIMessage(`<a href="/group_2/result.html" style="color:blue;text-decoration:underline;font-size:14px;">View Result</a>`)
        }
      })
    }
    
}

const setFirstQuestion=()=>{
  let data = localStorage.getItem("data")
  if(data !== undefined){
    data = JSON.parse(data)
    console.log(data);
    
    setAIMessage(data.ai_response)
    selectInputType(data.type)
    localStorage.removeItem("data")
  }
}


// for result
const interview_questions = document.getElementById("question_count")
const correct_questions = document.getElementById("correct_questions")
const wrong_questions = document.getElementById("wrong_questions")
const score = document.getElementById("score")
const correction_container = document.getElementById("interview_reviews")
const review = document.getElementById("review")

const result_loading = document.getElementById("result-loading")
const result_ready = document.getElementById("result-ready")

const setQuestionCorrection=(question)=>{
  return `<details
  class="flex flex-col border-t border-t-[#dbe2e6] dark:border-t-[#2d3748] py-2 group"
  open="">
  <summary class="flex cursor-pointer items-center justify-between gap-6 py-4 px-2">
      <p class="text-[#111618] dark:text-white text-base font-medium leading-normal">${
        question.question_asked.replace(/</g, '&lt;').replace(/>/g, '&gt;')
      }</p>
      <span
          class="material-symbols-outlined text-[#111618] dark:text-white group-open:rotate-180 transition-transform">expand_more</span>
  </summary>
  <div class="px-2 pb-4 space-y-2">
      <p class="text-red-500 dark:text-red-400 text-sm font-normal leading-normal"><span
              class="font-bold">Your Answer:</span> ${
                question.user_answe.replace(/</g, '&lt;').replace(/>/g, '&gt;')
              }</p>
      <p class="text-green-600 dark:text-green-400 text-sm font-normal leading-normal">
          <span class="font-bold">Correct Answer:</span> ${
            question.correct_answer.replace(/</g, '&lt;').replace(/>/g, '&gt;')
          }</p>
      <p class="text-[#617c89] dark:text-gray-400 text-sm font-normal leading-normal">
          <span class="font-bold">Explanation:</span> ${
            question.explanation.replace(/</g, '&lt;').replace(/>/g, '&gt;')
          }</p>
  </div>
</details>`
}

const goToHomePage=()=>{
  location = "index.html"
}

const goToResultPage=()=>{
  location = "result.html"
}



const requestInterviewResult=()=>{
  sendMessage("post","message/",{message:"Give me my interview result"})
      .then(res=>{
        console.log(res);
        const data = res.ai_response

        result_ready.style.display = "flex"
        result_loading.style.display = "none"

        interview_questions.innerText = data.total_questions
        correct_questions.innerText = data.num_correct_answers
        wrong_questions.innerText = data.num_wrong_answers
        score.innerText = data.interview_percentage
        review.innerText = data.review_from_ai

        let corrections = ""

        for (let i = 0; i < data.corrections.length; i++) {
          const element = data.corrections[i];
          corrections += setQuestionCorrection(element)
        }

        correction_container.innerHTML = corrections
    
      })
}


window.addEventListener("load",()=>{
  if(location.pathname === "result.html"){
    console.log("we are in result page");
    requestInterviewResult()
  }else if(location.pathname === "chat.html"){
    setFirstQuestion()
  }else if(location.pathname === "index.html"){
    generateId()
  }
})
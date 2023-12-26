import book from './data.js'

let sentenceArray = book.replace(/\n/g, " ").replace(/([.?!])\s*(?=[A-Z])/g, "|").split("|")
let page = 0
let data = []

for (let sentence of sentenceArray.slice(page * 100, (page + 1) * 100)) {
    let wordArray = sentence.split(" ")
    let p = document.createElement("p")
    for (let word of wordArray) {
        let span = document.createElement("span")
        if (wordArray.indexOf(word) === wordArray.length - 1) {
            span.innerHTML = word + ". "
        } else {
            span.innerHTML = word + " "
        }
        span.onclick = () => {
            console.log(12);
            if (!span.classList.contains("selectedSpan")) {
                span.classList.add("selectedSpan");
                translateQuestion(word, sentence)
            } else {
                span.classList.remove("selectedSpan");
                data.splice(data.indexOf(data.filter(obj => {
                    return obj.sentence === sentence
                })[0]), 1)
            }
        }
        p.appendChild(span)

    }
    cont.appendChild(p)

}

menuBtn.onclick = () => {
    console.log(123);
    menuBtn.classList.toggle("menuBtnSelected");
    menu.classList.toggle("menuSelected")
}

function translateQuestion(word, sentence) {
    fetch("https://translate-service.scratch.mit.edu/translate?language=en&text=" + sentence)
        .then(response => response.json())
        .then(commits => {
            data.push({
                word: word,
                sentence: sentence,
                translation: commits.result,
            })
            console.log(data);
        });
}

learnBtn.onclick = () => {
    learn.classList.add("learnSelected")
    // menu.classList.toggle("menuSelected")
    // menuBtn.classList.toggle("menuBtnSelected");
    let taskNumbers = [...data.keys()]
    let currentSentence = taskNumbers[Math.floor(Math.random() * taskNumbers.length)]
    console.log(taskNumbers);
    score.innerHTML = (data.length - taskNumbers.length) + "/" + data.length
    function getTask() {

        eng.innerHTML = data[currentSentence].translation
        let words = data[currentSentence].sentence.split(/\r?\n/)[0].split(" ")
        let newSentence = ""
        for (let word of words) {
            if (word.includes(data[currentSentence].word)) {
                newSentence = newSentence + '<input id="wordInp" type="text" size="10"> '
            }
            else {
                newSentence = newSentence + word + " "
            }
        }
        fr.innerHTML = newSentence
        wordInp.focus()
    }
    getTask()


    ok.onclick = (event) => {
        event.preventDefault()
        if (ok.innerHTML === "Ok") {
            if (wordInp.value.toLowerCase() === data[currentSentence].word.toLowerCase()) {
                answer.innerHTML = "Correct!"
                taskNumbers.splice(taskNumbers.indexOf(currentSentence), 1)
                score.innerHTML = (data.length - taskNumbers.length) + "/" + data.length
            } else {
                answer.innerHTML = "Wrong! Correct answer: " + data[currentSentence].word

            }
            wordInp.disabled = true
            currentSentence = taskNumbers[Math.floor(Math.random() * taskNumbers.length)]
            ok.innerHTML = "Next"
            ok.focus()
        } else {
            if (taskNumbers.length > 0) {

                getTask()
                ok.innerHTML = "Ok"
                answer.innerHTML = "-"
                wordInp.disabled = false

            } else {
                ok.disabled = true
                answer.innerHTML = "Lesson complete!"
            }
        }
    }

    reset.onclick = () => {
        taskNumbers = [...data.keys()]
        currentSentence = taskNumbers[Math.floor(Math.random() * taskNumbers.length)]
        score.innerHTML = (data.length - taskNumbers.length) + "/" + data.length
        getTask()
        ok.disabled = false
        ok.innerHTML = "Ok"
        answer.innerHTML = "-"
    }
}

readBtn.onclick = () => {
    learn.classList.remove("learnSelected")
}
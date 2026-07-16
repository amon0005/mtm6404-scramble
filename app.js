/**********************************************
 * STARTER CODE
 **********************************************/

/**
 * shuffle()
 * Shuffle the contents of an array
 *   depending the datatype of the source
 * Makes a copy. Does NOT shuffle the original.
 * Based on Steve Griffith's array shuffle prototype
 * @Parameters: Array or string
 * @Return: Scrambled Array or string, based on the provided parameter
 */
function shuffle (src) {
  const copy = [...src]

  const length = copy.length
  for (let i = 0; i < length; i++) {
    const x = copy[i]
    const y = Math.floor(Math.random() * length)
    const z = copy[y]
    copy[i] = z
    copy[y] = x
  }

  if (typeof src === 'string') {
    return copy.join('')
  }

  return copy
}

/**********************************************
 * YOUR CODE BELOW
 **********************************************/

const { useState, useEffect } = React


function ScrambleGame() {

  const originalWords = [
    "javascript",
    "computer",
    "keyboard",
    "developer",
    "website",
    "function",
    "variable",
    "component",
    "browser",
    "internet"
  ]


  const [words, setWords] = useState([])
  const [currentWord, setCurrentWord] = useState("")
  const [scrambledWord, setScrambledWord] = useState("")
  const [guess, setGuess] = useState("")

  const [points, setPoints] = useState(0)
  const [strikes, setStrikes] = useState(0)
  const [passes, setPasses] = useState(3)

  const [message, setMessage] = useState("")
  const [gameOver, setGameOver] = useState(false)



  // Load saved game when page opens
  useEffect(() => {

    const savedWords = JSON.parse(localStorage.getItem("words"))
    const savedPoints = localStorage.getItem("points")
    const savedStrikes = localStorage.getItem("strikes")
    const savedPasses = localStorage.getItem("passes")


    if (savedWords && savedWords.length > 0) {

      setWords(savedWords)
      setPoints(Number(savedPoints))
      setStrikes(Number(savedStrikes))
      setPasses(Number(savedPasses))

      chooseWord(savedWords)

    } 
    else {

      startNewGame()

    }

  }, [])



  // Save game whenever values change
  useEffect(() => {

    localStorage.setItem(
      "words",
      JSON.stringify(words)
    )

    localStorage.setItem(
      "points",
      points
    )

    localStorage.setItem(
      "strikes",
      strikes
    )

    localStorage.setItem(
      "passes",
      passes
    )

  }, [words, points, strikes, passes])





  function startNewGame(){

    const newWords = shuffle(originalWords)

    setWords(newWords)

    setPoints(0)
    setStrikes(0)
    setPasses(3)

    chooseWord(newWords)

    setGameOver(false)

    setMessage("")

  }



  function chooseWord(wordList){

    if(wordList.length === 0){

      setGameOver(true)
      return

    }


    const selected = wordList[0]


    setCurrentWord(selected)

    setScrambledWord(
      shuffle(selected)
    )

  }




  function nextWord(){

    const remaining = words.slice(1)

    setWords(remaining)

    chooseWord(remaining)

  }





  function checkGuess(event){

    event.preventDefault()


    if(gameOver){
      return
    }


    if(
      guess.toLowerCase() === 
      currentWord.toLowerCase()
    ){

      setPoints(points + 1)

      setMessage("Correct! Great job.")

      nextWord()

    }
    else{

      const newStrikes = strikes + 1

      setStrikes(newStrikes)

      setMessage("Incorrect. Try again.")


      if(newStrikes >= 3){

        setGameOver(true)

      }

    }


    setGuess("")

  }





function passWord(){

  if(passes > 0 && !gameOver){

    setPasses(passes - 1)

    setMessage("Word skipped.")

    nextWord()

  }

}





function resetGame(){

  localStorage.clear()

  startNewGame()

}






return (

<div className="game">


<h1>Scramble</h1>


{
gameOver ?


<div>

<h2>Game Over</h2>

<p>
Final Score: {points}
</p>

<button onClick={resetGame}>
Play Again
</button>

</div>


:


<div>


<h2>
Unscramble this word:
</h2>


<div className="word">

{scrambledWord}

</div>



<form onSubmit={checkGuess}>


<input

type="text"

value={guess}

onChange={
(e)=>setGuess(e.target.value)
}

placeholder="Enter your guess"

/>


<button>
Submit
</button>


</form>



<p>
{message}
</p>



<div className="stats">

<p>
Points: {points}
</p>


<p>
Strikes: {strikes}/3
</p>


<p>
Passes: {passes}
</p>


</div>



<button

onClick={passWord}

disabled={passes === 0}

>

Pass

</button>


</div>


}


</div>

)

}



ReactDOM
.createRoot(
document.body
)
.render(
<ScrambleGame />
)
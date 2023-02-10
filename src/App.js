import React, { useEffect, useState } from 'react'
import axios from 'axios'

const App = () => {

    const [word, setWords] = useState('')
    const [synonyms, setSynonyms] = useState('')
    const [error, setError] = useState('')
    const [points, setPoints] = useState(0)
    const [prevWord, setPrevWord] = useState('')

    useEffect(() => {
        getRandomWord()
    }, [])


    const getRandomWord = async () => {
        const options = {
            method: 'GET',
            url: 'https://random-word-by-api-ninjas.p.rapidapi.com/v1/randomword',
            params: { type: 'adjective' },
            headers: {
                'X-RapidAPI-Key': process.env.REACT_APP_RAPID_API_KEY,
                'X-RapidAPI-Host': 'random-word-by-api-ninjas.p.rapidapi.com'
            }
        };

        axios.request(options).then(function (response) {
            setWords(response.data.word)
        }).catch(function (error) {
            console.error(error);
        });
    }


    const handleSubmit = async (e) => {
        try {
            e.preventDefault()
            const response = await axios.get(`https://api.datamuse.com/words?rel_syn=${word}`)
            const synonym = response.data.map((syn) => syn.word)
            setSynonyms('')
            if (synonyms === '') {
                setError('Please enter a synonym')
            }
            else if (synonym.includes(synonyms)) {
                if (synonyms === prevWord) {
                    setError("You can't enter the same word twice")
                } else {
                    const randomNumber = Math.floor(Math.random() * 990) + 10
                    setPoints(points + randomNumber)
                    setPrevWord(synonyms)
                    setError('')
                }
            } else {
                setError('Incorrect answer');
                setPoints(points)
            }
        } catch (error) {
            console.log('error')
        }
    }

    const newWord = () => {
        getRandomWord()
    }

    const Reset = () => {
        setPoints(0)
        getRandomWord()
        setError('')
    }

    return (
        <div className='App'>
            <div className="random">
                <h1 className='random-word'>Random Word</h1>
                {error && <div className="error">{error}</div>}
                <p className='random-word' htmlFor="random-word">{word}</p>
            </div>
            <form className='form' onSubmit={handleSubmit}>
                <label htmlFor="word-input">Your Word:</label>
                <input type="text"
                    name='input-box'
                    id='word-input'
                    value={synonyms}
                    onChange={(e) => setSynonyms(e.target.value)}
                    autoComplete='off' />
            </form>
            <h5>Points: {points}</h5>
            <div className="buttons">
                <button onClick={() => newWord()}>Choose New Word</button>
                <button onClick={() => Reset()}>Reset</button>
            </div>
        </div>
    )
}

export default App
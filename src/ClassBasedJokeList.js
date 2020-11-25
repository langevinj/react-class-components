import React from 'react';
import axios from "axios"
import Joke from "./Joke"
import ClassBasedJoke from './ClassBasedJoke'

class ClassBasedJokeList extends React.Component {
    static defaultProps = {
        numJokesToGet: 10
    }

    constructor(props) {
        super(props);
        this.state = { jokes: []};
        this.generateNewJokes = this.generateNewJokes.bind(this)
        this.vote = this.vote.bind(this)
    }

    async getJokes() {
        let j = [...this.state.jokes]
        let seenJokes = new Set();
        try {
            while (j.length < this.props.numJokesToGet) {
                let res = await axios.get("https://icanhazdadjoke.com", {
                    headers: { Accept: "application/json" }
                });

                let { status, ...jokeObj } = res.data

                if (!seenJokes.has(jokeObj.id)) {
                    seenJokes.add(jokeObj.id);
                    j.push({ ...jokeObj, votes: 0 });
                } else {
                    console.error('duplicate found!');
                }
            }
            this.setState({ jokes: j });
        } catch (e) {
            console.log(e)
        }
    }

    async componentDidMount() {
        if (this.state.jokes.length < 10) this.getJokes();
    }

    async componentDidUpdate() {
        if (this.state.jokes.length < 10) this.getJokes();
    }

    generateNewJokes() {
        this.setState({jokes: []})
    }

    vote(id, delta) {
        this.setState(st => ({ jokes: st.jokes.map(j => j.id === id ? { ...j, votes: j.votes + delta} : j)
        }));
    }

    

    render() {
            let sortedJokes = [...this.state.jokes].sort((a, b) => b.votes - a.votes);

            return (
                <div className="JokeList">
                    <button className="JokeList-getmore" onClick={this.generateNewJokes}>
                    Get New Jokes
                    </button>
                    {sortedJokes.map(j => (
                        <ClassBasedJoke text={j.joke} key={j.id} id={j.id} votes={j.votes} vote={this.vote} />
                    ))}

                    {sortedJokes.length < this.props.numJokesToGet ? (
                        <div className="loading">
                            <p>Loading!</p>
                        </div>
                    ) : null}
                </div>

        )
    }
}

export default ClassBasedJokeList;
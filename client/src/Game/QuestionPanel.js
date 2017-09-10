import React, { Component } from 'react';
import Container from 'muicss/lib/react/container';
import Row from 'muicss/lib/react/row';
import Col from 'muicss/lib/react/col';
import './GameRoom.css';
import SongButton from './SongButton.js';
import GameService from '../services/GameService.js';
import PlayerEvents from '../common/PlayerEvents.js';
import GameEvents from '../common/GameEvents.js';
import ReactPlayer from 'react-player'

class QuestionPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentAnswer: null
        }

        this.onNewAnswer = this.onNewAnswer.bind(this);
        this.getAnswerColor = this.getAnswerColor.bind(this);
    }

    componentDidMount() {
        GameService.onEvent(GameEvents.NEW_ANSWER, this.onNewAnswer);
    }

    onNewAnswer(answer) {
        let tempAnswer = answer;
        //Set current answer, but after 1000ms reset to null if it has not changed. This is so the color highlight only lasts 1000ms per new answer.
        this.setState({
            currentAnswer: answer
        }, () => {
            setTimeout(() => {
                if (this.state.currentAnswer && tempAnswer.answerSongId === this.state.currentAnswer.answerSongId) {
                    this.setState({
                        currentAnswer: null
                    });
                }
            }, 1000);
        });
    }

    getAnswerColor(song) {
        if (song && this.state.currentAnswer && song.id === this.state.currentAnswer.answerSongId) {
            return this.state.currentAnswer.isCorrect ? "lightgreen" : "red";
        } else {
            return "transparent";
        }
    }

    render() {
        let containerStyle = {
            width: "100vh",
            height: "60vh"
        };

        if (this.props.question) {
            return (
                <Container fluid={true} style={containerStyle} className="QuestionPanel">
                    <Row className="first-row-buttons QuestionRow" noGutters={true}>
                        <Col md="6">
                            <SongButton
                                enabled={this.props.canAnswer}
                                song={this.props.question.songOptions[0]}
                                onAnswer={this.props.onAnswer}
                                color={this.getAnswerColor(this.props.question.songOptions[0])}
                            />
                        </Col>

                        <Col md="6">
                            <SongButton
                                enabled={this.props.canAnswer}
                                song={this.props.question.songOptions[1]}
                                onAnswer={this.props.onAnswer}
                                color={this.getAnswerColor(this.props.question.songOptions[1])}
                            />
                        </Col>
                    </Row>

                    <Row className="QuestionRow">
                        <Col md="6">
                            <SongButton
                                enabled={this.props.canAnswer}
                                song={this.props.question.songOptions[2]}
                                onAnswer={this.props.onAnswer}
                                color={this.getAnswerColor(this.props.question.songOptions[2])}
                            />
                        </Col>

                        <Col md="6">
                            <SongButton
                                enabled={this.props.canAnswer}
                                song={this.props.question.songOptions[3]}
                                onAnswer={this.props.onAnswer}
                                color={this.getAnswerColor(this.props.question.songOptions[3])}
                            />
                        </Col>
                    </Row>

                    <Row>
                        <Col md="0">
                            <ReactPlayer
                                url={this.props.question.previewUrl}
                                playing={Boolean(this.props.question)}
                            />
                        </Col>
                    </Row>
                </Container>
            )
        } else {
            return (
                <Container fluid={true} style={containerStyle} className="QuestionPanel">

                </Container>
            )
        }

    }
}

export default QuestionPanel;
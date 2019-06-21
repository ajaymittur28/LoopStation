import React from "react"
import { Sound } from "../modules/Sound"
import loopButtonStyle from "../styles/modules/loopButton.module.css"

class LoopButton extends React.Component {
	constructor(props) {
		super(props)
		this.initialModes = ["Record", "Stop", "Play", "Pause"]
		this.audioManager = new Sound()
		this.state = {
			style: loopButtonStyle.normal,
			modes: [...this.initialModes],
			mode: this.initialModes[0]
		}
	}

	checkSoundMethodToCall = () => {
		return new Promise((resolve, reject) => {
			if (this.state.mode === "Record") resolve(this.audioManager.record)
			else if (this.state.mode === "Stop") resolve(this.audioManager.stop)
			else if (this.state.mode === "Play") resolve(this.audioManager.play)
			else if (this.state.mode === "Pause") resolve(this.audioManager.pause)
			else reject("Error: Incorrect Button Mode")
		})
	}

	handleSingleClick = () => {
		this.checkSoundMethodToCall()
			.then(methodToCall => methodToCall())
			.catch(e => console.log(e))
		this.setState(currentState => {
			// Change previous modes ie. shift them to the left
			// by 1 position in a circular manner
			let newModes
			let currentMode = currentState.modes.shift()
			if (currentMode !== "Pause") {
				// Remove 1st element and add it to the end
				currentState.modes.push(currentMode)
				newModes = currentState.modes
			} else {
				// Remove last element and add it to the beginning
				let prevMode = currentState.modes.pop()
				currentState.modes.unshift(currentMode)
				currentState.modes.unshift(prevMode)
				newModes = currentState.modes
			}

			return {
				id: currentState.id,
				style:
					currentState.style === loopButtonStyle.normal
						? loopButtonStyle.clicked
						: loopButtonStyle.normal,
				modes: newModes,
				mode: newModes[0]
			}
		})
	}

	handleDoubleClick = () => {
		this.audioManager.clear()
		this.setState(() => ({
			style: loopButtonStyle.normal,
			modes: [...this.initialModes],
			mode: this.initialModes[0]
		}))
	}

	componentWillReceiveProps(newProps) {
		if (newProps.shouldPlayAll) {
			this.setState(() => ({
				style: loopButtonStyle.clicked,
				modes: ["Play", "Pause", "Record", "Stop"],
				mode: "Play"
			}))
			this.audioManager.play()
		} else {
			this.setState(() => ({
				style: loopButtonStyle.normal,
				modes: ["Pause", "Record", "Stop", "Play"],
				mode: "Pause"
			}))
			this.audioManager.pause()
		}
		if (newProps.shouldClearAll) {
			this.handleDoubleClick()
		}
	}

	// Lifecycle method below keeps updating until maximum stack depth is reached
	// if setState() is used as it keeps calling itself (until max recursion depth)
	// componentDidUpdate() {
	// 	if (this.props.shouldPlayAll) {
	// 		this.audioManager.play()
	// 	} else {
	// 		this.audioManager.pause()
	// 	}
	// 	if (this.props.shouldClearAll) {
	// 		this.audioManager.clear()
	// 	}
	// }

	render() {
		return (
			<button
				type="button"
				className={this.state.style}
				onClick={this.handleSingleClick}
				onDoubleClick={this.handleDoubleClick}>
				{this.state.mode}
			</button>
		)
	}
}

export default LoopButton

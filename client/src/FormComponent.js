import React from "react"

function FormComponent(props) {
    return (
        <form onSubmit={props.handleSubmit}>
            <label for="message">Send a message  </label>
            <input type="text" name="text"  value={props.text.text} onChange={props.handleChange} />
            <input type="submit" value='Send'/>
        </form>
    )
}

export default FormComponent
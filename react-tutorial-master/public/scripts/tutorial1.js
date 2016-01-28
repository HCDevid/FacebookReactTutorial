// First tutorial script

var CommentBox = React.createClass({
	render: function () {
		return (
			<div className="commentBox">
				Hello World! I am a CommentBox component.
			</div>
		);
	}
});

ReactDOM.render(
	<CommentBox />,
	document.getElementById('content')  //Renders the CommentBox component inside the '.content' class div in the body file.
);
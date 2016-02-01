// Implementation of server-based data and onwards


var CommentBox = React.createClass({
	getInitialState: function() {
		return {data: []};
	},

	loadCommentsFromServer: function() {
		$.ajax({
			url: this.props.url, //references ReactDOM.render function input "/api/comments"
			datatype: 'json',
			cache: 'false',
			success: function(data) {
				this.setState({data: data});
			}.bind(this),
			error: function(xhr, status, err) {
				console.error(this.props.url, status, err.toString());
			}.bind(this)
		});
	},

	componentDidMount: function() {
		this.loadCommentsFromServer();
		setInterval(this.loadCommentsFromServer(), this.props.pollInterval);
	},

	// handleCommentSubmit exists as a callback to pass data from child "CommentForm" component into the wider CommentBox component so CommentList can process.
	handleCommentSubmit: function(comment) {
		$.ajax({
			url: this.props.url,
			datatype: 'json',
			type: 'POST',
			data: comment,
			success: function(data) {
				this.setState({data: data});
			}.bind(this),
			error: function(xhr, status, err) {
				console.error(this.props.url, status, err.toString());
			}.bind(this) 
		});
	},

	render: function() {
	    return (
	      <div className="commentBox">
	        <h1>Comments</h1>
	        <CommentList data={this.state.data} />
	        <CommentForm onCommentSubmit={this.handleCommentSubmit} />
	      </div>
	    );
	}
});

var CommentList = React.createClass({
	render: function() {
		var commentNodes = this.props.data.map(function(comment) {
			return (
				<Comment author={comment.author} key={comment.id}>
					{comment.text}
				</Comment>
			);
		});
		return (
			<div className='commentList'>
				{commentNodes}
			</div>
		);
	}
});

var CommentForm = React.createClass({
	getInitialState: function() {
		return {author: '', text: ''};
	},
	handleAuthorChange: function(e) {
		this.setState({author: e.target.value});
	},
	handleTextChange: function(e) {
		this.setState({text: e.target.value});
	},
	// handleSubmit is called when an onSubmit event happens, and passes data from from into state as an "onCommentSubmit" prop
	handleSubmit: function(e) {
		e.preventDefault();
		var author = this.state.author.trim();
		var text = this.state.text.trim();
		if (!author || !text) {
			return;
		}
		this.props.onCommentSubmit({author: author, text: text}); //Is the actual call/event initiation for the onCommentSubmit event
		this.setState({author: '', text: ''});
	},
	render: function() {
		return (
			<form className="commentForm" onSubmit={this.handleSubmit} >
				<input 
					type="text" 
					placeholder="Your name"
					value={this.state.author}
					onChange={this.handleAuthorChange}
				/>
				<input 
					type="text" 
					placeholder="Say something..."
					value={this.state.text}
					onChange={this.handleTextChange}
				/>
				<input type="submit" value="Post" />
			</form>
		);
	}
});

var Comment = React.createClass({
	rawMarkup: function() {
		var rawMarkup = marked(this.props.children.toString(), {sanitize: true});
		return { __html: rawMarkup};
	},

	render: function () {
		return (
			<div className="comment">
				<h2 className="commentAuthor">
					{this.props.author}
				</h2>
				<span dangerouslySetInnerHTML = {this.rawMarkup()} />
			</div>
		);
	}
});

ReactDOM.render(
	<CommentBox url="/api/comments" pollInterval={2000} />,
	document.getElementById('content')  //Renders the CommentBox component inside the '.content' class div in the body file.
);
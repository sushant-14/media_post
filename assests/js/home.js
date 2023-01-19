{
    // method to submit the form data for new post using AJAX
    let createPost = function () {
        let newPostForm = $('#new-post-form');
        newPostForm.submit(function (e) {
            e.preventDefault();

            $.ajax({
                type: 'post',
                url: '/posts/create',
                data: newPostForm.serialize(),
                success: function (data) {
                    // console.log("data",data)
                    let newPost = newPostDom(data.data.post);
                    // prepend is a function in a jquery to add a item in first position
                    //  and when write append they add in last 
                    $('#posts-list-container>ul').prepend(newPost)
                }, error: function (error) {
                    console.log(error.responseText);
                }
            })
        })

    }
    // method to create apost in DOM
    let newPostDom = function(post) {
        return $(`<li id="post-${post._id}">
        <p>
           <small>
                <a class="delete-post-button" href="/posts/destroy/${post.id}"><i class="fa fa-close" style="font-size:24px"></i></a>
            </small>
            <div class="post-content">
            ${post.content}
                <br>
                <small>
                ${post.user.name}
                </small>
            </div>
        </p>
    
        <div class="posts-comments">
                <form action="/comments/create" id="new-post-comment" method="POST">
                    <input type="text" name="content" placeholder="type here comment..." required>
                    <input type="hidden" name="post" value="${post._id}">
                    <input type="submit" value="Comment">
                </form>
    
        
        <div class="post-comments-list">
            <ul id="post-comments-${post._id}">
              
            </ul>
        </div>
    </div>
        <hr>
    </li>`)
    }

    createPost();

}

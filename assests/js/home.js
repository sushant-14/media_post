// home post.js file
{
    // method to submit the form data for new post using AJAX
    let createPost = function () {
        let newPostForm = $('#new-post-form');
        newPostForm.submit(function (e) {
            e.preventDefault();
// manual submit the form 
            $.ajax({
                type: 'post',
                url: '/posts/create',
                data: newPostForm.serialize(),
                cache: false,
                success: function (data) {
                    // console.log("data",data)
                    let newPost = newPostDom(data.data.post);
                    // prepend is a function in a jquery to add a item in first position
                    //  and when write append they add in last 
                    $('#posts-list-container>ul').prepend(newPost);

                    // Apply CSS styles to the new post
                    newPost.find('.delete-post-button').css({
                        'font-size': '24px',
                        'color': 'red'
                    });
                    deletePost($(' .delete-post-button',newPost));

                    // ...
                    // call the create comment class
                    new PostComments(data.data.post._id);

                    // CHANGE :: enable the functionality of the toggle like button on the new post
                    new ToggleLike($(' .toggle-like-button', newPost));

                    new Noty({
                        theme: 'relax',
                        text: "Post published!",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                        
                    }).show();
                    // ...

                }, error: function (error) {
                    console.log(error.responseText);
                }
            })
        })

    }
    // method to create apost in DOM
    let newPostDom = function(post) {
        // console.log("post",post)
        return $(`<li id="post-${post._id}">
        <p>
           <small>
                <a class="delete-post-button" href="/posts/destroy/${ post._id }"><i class="fa fa-close" style="font-size:24px"></i></a>
            </small>

          ${ post.content }
                <br>
                <small>
                ${ post.user.name }
                </small>
                <br>
                <small>
                    <a class="toggle-like-button" data-likes="0" href="/likes/toggle/?id=${post._id}&type=Post">
                        0 Likes
                    </a>

                </small>
          
        </p>
    
        <div class="posts-comments">
                <form action="/comments/create" id="post-${ post._id }-comments-form" method="POST" class="new-post-comment">
                    <input type="text" name="content" placeholder="type here comment..." required>
                    <input type="hidden" name="post" value="${ post._id }">
                    <input type="submit" value="Add Comment">
                </form>
    
        
        <div class="post-comments-list">
            <ul id="post-comments-${ post._id }">
              
            </ul>
        </div>
    </div>
        <hr>
    </li>`)
    }

   
    // method to delta a post frm DOM
    // let deletePost=function(deleteLink){
    //     $(deleteLink).click(function(e){
    //         e.preventDefault();

    //         $.ajax({
    //             type:'get',
    //             url:$(deleteLink).prop('href'),
    //             success:function(data){
    //                 $(`$post-${data.data.post_id}`).remove();

    //             },error:function(error){
    //                 console.log(error.responseText);

    //             }
    //         })
    //     })
    // }

    // ...
    // method to delete a post from DOM
    let deletePost = function(deleteLink){
        $(deleteLink).click(function(e){
            e.preventDefault();

            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                cache: false,
                success: function(data){
                    $(`#post-${data.data.post_id}`).remove();
                    new Noty({
                        theme: 'relax',
                        text: "Post Deleted",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                        
                    }).show();
                },error: function(error){
                    console.log(error.responseText);
                }
            });

        });
    }

       // loop over all the existing posts on the page (when the window loads for the first time) and call the delete post method on delete link of each, also add AJAX (using the class we've created) to the delete button of each
       let convertPostsToAjax = function(){
        $('#posts-list-container>ul>li').each(function(){
            let self = $(this);
            let deleteButton = $(' .delete-post-button', self);
            deletePost(deleteButton);

            // get the post's id by splitting the id attribute
            let postId = self.prop('id').split("-")[1]
            new PostComments(postId);
        });
    }

// ...




    createPost();
    // ..
    convertPostsToAjax();
    // ..


}

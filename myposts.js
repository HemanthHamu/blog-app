document.addEventListener('DOMContentLoaded', function () {
    loadPosts();
  });
  
  function loadPosts() {
    var postsContainer = document.getElementById('posts');
    var posts = JSON.parse(localStorage.getItem('posts')) || [];
  
    // Clear existing posts
    postsContainer.innerHTML = '';
  
    if (posts.length === 0) {
      // Display a message (No posts yet) when there are no posts
      var noPostsMessage = document.createElement('div');
      noPostsMessage.className = 'no-posts'
      noPostsMessage.textContent = 'No posts yet ........';
      postsContainer.appendChild(noPostsMessage);
      noPostsMessage.style.color = 'black';
    } else {
      posts.reverse().forEach(function(post, index) {
        var postElement = createPostElement(post, index);
        postsContainer.appendChild(postElement);
      });
    }
  }
  
  function createPostElement(post, index) {
    var postElement = document.createElement('div');
    postElement.className = 'post';
  
    var textElement = document.createElement('div');
    textElement.style.boxShadow = '0 0 2px #fff';
    textElement.style.border = 'none';
    textElement.style.borderRadius = '10px'
    textElement.style.padding = '10px'
    textElement.textContent = post.content; 
  
    var dateElement = document.createElement('div');
    dateElement.className = 'post-date';
    dateElement.textContent = 'Posted on ' + post.date;
  
    var deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', function() {
      deletePost(index);
    });
    postElement.appendChild(textElement);
    postElement.appendChild(dateElement);
    postElement.appendChild(deleteButton);
  
    return postElement;
  }
  
  function deletePost(index) {
    var posts = JSON.parse(localStorage.getItem('posts')) || [];
    
    if (index >= 0 && index < posts.length) {
      posts.splice(index, 1); // Remove the post at the specified index
      localStorage.setItem('posts', JSON.stringify(posts));
      loadPosts(); // Reload posts after deletion
    }
  }
  
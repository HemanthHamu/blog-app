
function publishPost() {
    var postContent = document.getElementById('postContent').value;
  
    if (postContent.trim() !== '') {
      // Save post to local storage with current date
      var postWithDate = { content: postContent, date: new Date().toLocaleDateString() };
      var posts = JSON.parse(localStorage.getItem('posts')) || [];
      posts.push(postWithDate);
      localStorage.setItem('posts', JSON.stringify(posts));
  
      // Clear the textarea after publishing
      document.getElementById('postContent').value = '';
  
      // Display all posts with delete buttons
      loadPosts();
    }
    else{
      var noContent = document.getElementById('no-content');
      noContent.innerHTML = "Please type something and post it";
      noContent.style.display = 'inline'
    }
  }
  
  function loadPosts() {
    var postsContainer = document.getElementById('posts');
    var posts = JSON.parse(localStorage.getItem('posts')) || [];
  
    // Clear existing posts
    postsContainer.innerHTML = '';
  
    // Display all posts with delete buttons
    posts.forEach(function(post, index) {
      var postElement = document.createElement('div');
      postElement.className = 'post';
      postElement.textContent = post.content;
  
      var dateElement = document.createElement('div');
      dateElement.className = 'post-date';
      dateElement.textContent = 'Posted on ' + post.date;
  
      var deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      deleteButton.addEventListener('click', function() {
        deletePost(index);
        loadPosts(); // Reload posts after deletion
      });
  
      postElement.appendChild(dateElement);
      postElement.appendChild(deleteButton);
      postsContainer.appendChild(postElement);
    });
  }
  
  function deletePost(index) {
    var posts = JSON.parse(localStorage.getItem('posts')) || [];
    posts.splice(index, 1); // Remove the post at the specified index after clicking delete button
    localStorage.setItem('posts', JSON.stringify(posts));
  }

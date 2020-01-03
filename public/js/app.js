$(document).ready(function() {
  // Click Listener on Saved Button
  $("#saved").on("click", function() {
    $.get("/api/articles/saved", function(responses) {
      renderSavedArticles(responses);
    });
  });

  // Click Listener on Articles Button
  $("#articles").on("click", function() {
    $.get("/api/articles/", function(responses) {
      renderArticles(responses);
    });
  });

  // Set Click Listener on Scrape Button
  $("#scrape").on("click", function() {
    $.get("/api/scrape", function() {
      $.get("/api/articles", function(responses) {
        renderArticles(responses);
      });
    });
  });
});

function renderArticles(articles) {
  $("#article-list").empty();
  articles.forEach(article => {
    let articleDiv = $("<div id=article_box>");
    let header = $(`<h3>`).html(
      `<a href=${article.link}>${article.headline}</a>`
    );
    let story = $("<p>").text(article.story);
    articleDiv.append(header);
    articleDiv.append(story);
    articleDiv.append(
      `<span>\
            <button class='btn btn-primary btn-sm add_comment' data-id=${article._id}>Add Comment</button>\
            <button class='btn btn-primary btn-sm see_comments' data-id=${article._id}>See Comments</button>\
            <button class='btn btn-primary btn-sm save_article' data-id=${article._id}>Save Article</button>\
        </span>`
    );
    $("#article-list").append(articleDiv);
  });

  // Modal Logic
  $(".add_comment").on("click", function() {
    // Toggle Modal On
    $("#myModal").modal("toggle");

    let theID = $(this).attr("data-id");

    // On Submit
    $("#submit").on("click", function(event) {
      event.preventDefault();

      var data = {
        title: $("#title").val(),
        body: $("#body").val()
      };

      $.ajax({
        type: "POST",
        url: "/api/articles/" + theID,
        data: data,
        success: function() {
          $("#myModal").modal("toggle");
        }
      });
    });
  });

  // Modal Logic
  $(".see_comments").on("click", function() {
    let theID = $(this).attr("data-id");

    $.get(`/api/articles/${theID}`, function(response) {
      const body = $("#modal-body");
      body.empty();
      body.append("<h1>Comments</h1>");

      response[0].comments.map(function(comment) {
        let commentContainer = $("<div>");

        let commentTitle = $("<b>").text(comment.title);
        let commentBody = $("<p>").text(comment.body);

        commentContainer.append(commentTitle);
        commentContainer.append(commentBody);

        body.append(commentContainer);
      });

      $("#commentsModal").modal("toggle");
    });
  });

  // Modal Logic
  $(".save_article").on("click", function() {
    let theID = $(this).attr("data-id");

    var data = {
      saved: true
    };

    $.ajax({
      type: "POST",
      url: "/api/articles/save/" + theID,
      data: data
    });
  });
}

function renderSavedArticles(articles) {
  $("#article-list").empty();
  articles.forEach(article => {
    let articleDiv = $("<div id=article_box>");
    let header = $(`<h3>`).html(
      `<a href=${article.link}>${article.headline}</a>`
    );
    let story = $("<p>").text(article.story);
    articleDiv.append(header);
    articleDiv.append(story);
    articleDiv.append(
      `<span>\
            <button class='btn btn-primary btn-sm see_comments' data-id=${article._id}>See Comments</button>\
            <button class='btn btn-primary btn-sm save_article' data-id=${article._id}>Remove Saved Article</button>\
        </span>`
    );
    $("#article-list").append(articleDiv);
  });

  // Modal Logic
  $(".see_comments").on("click", function() {
    let theID = $(this).attr("data-id");

    $.get(`/api/articles/${theID}`, function(response) {
      const body = $("#modal-body");
      body.empty();
      body.append("<h1>Comments</h1>");

      response[0].comments.map(function(comment) {
        let commentContainer = $("<div>");

        let commentTitle = $("<b>").text(comment.title);
        let commentBody = $("<p>").text(comment.body);

        commentContainer.append(commentTitle);
        commentContainer.append(commentBody);

        body.append(commentContainer);
      });

      $("#commentsModal").modal("toggle");
    });
  });

  // Modal Logic
  $(".save_article").on("click", function() {
    let theID = $(this).attr("data-id");

    var data = {
      saved: false
    };

    $.ajax({
      type: "POST",
      url: "/api/articles/save/" + theID,
      data: data
    });
  });
}

$(document).ready(function() {
  //Saved Button
  $("#saved").on("click", function() {
    $.get("/api/articles/saved", function(responses) {
      renderSavedArticles(responses);
    });
  });

  //Articles Button
  $("#articles").on("click", function() {
    $.get("/api/articles/", function(responses) {
      renderArticles(responses);
    });
  });

  // Scrape Button
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
            <button class='btn btn-primary btn-sm add_note' data-id=${article._id}>Add Notexs</button>\
            <button class='btn btn-primary btn-sm see_notes' data-id=${article._id}>See Notes</button>\
            <button class='btn btn-primary btn-sm save_article' data-id=${article._id}>Save Article</button>\
        </span>`
    );
    $("#article-list").append(articleDiv);
  });

  // Modal Logic
  $(".add_note").on("click", function() {
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
  $(".see_notes").on("click", function() {
    let theID = $(this).attr("data-id");

    $.get(`/api/articles/${theID}`, function(response) {
      const body = $("#modal-body");
      body.empty();
      body.append("<h1>Notes</h1>");

      response[0].notes.map(function(notes) {
        let noteContainer = $("<div>");

        let noteTitle = $("<b>").text(note.title);
        let noteBody = $("<p>").text(note.body);

        noteContainer.append(noteTitle);
        noteContainer.append(noteBody);

        body.append(noteContainer);
      });

      $("#notesModal").modal("toggle");
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
            <button class='btn btn-primary btn-sm see_notes' data-id=${article._id}>See Notes</button>\
            <button class='btn btn-primary btn-sm save_article' data-id=${article._id}>Remove Saved Article</button>\
        </span>`
    );
    $("#article-list").append(articleDiv);
  });

  // Modal Logic
  $(".see_notes").on("click", function() {
    let theID = $(this).attr("data-id");

    $.get(`/api/articles/${theID}`, function(response) {
      const body = $("#modal-body");
      body.empty();
      body.append("<h1>Notes</h1>");

      response[0].notes.map(function(note) {
        let noteContainer = $("<div>");

        let noteTitle = $("<b>").text(note.title);
        let noteBody = $("<p>").text(note.body);

        noteContainer.append(noteTitle);
        noteContainer.append(noteBody);

        body.append(noteContainer);
      });

      $("#notesModal").modal("toggle");
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

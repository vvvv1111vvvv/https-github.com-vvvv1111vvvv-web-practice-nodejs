var sanitizeHtml = require('sanitize-html');
module.exports= {
    HTML:function(title, list, body, control, authStatusUI=`<a href="/auth/login">Sign in</a> | <!--<a href="/auth/register">Sign up</a>-->`){
      return `
      <!doctype html>
      <html>
      <head>
        <title>WEB1 - ${title}</title>
        <meta charset="utf-8">
      </head>
      <body>
        ${authStatusUI}
        <h1><a href="/">WEB</a></h1>
        <!--<a href="/author">author</a>-->
        ${list}
        ${control}
        ${body}
      </body>
      </html>
      `;
    },list:function(topics){
      var list = '<ul>';
      var i = 0;
      while(i < topics.length){
        list = list + `<li><a href="/topic/?id=${topics[i].id}">${sanitizeHtml(topics[i].title)}</a></li>`;
        i = i + 1;
      }
      list = list+'</ul>';
      return list;
    },/*authorSelect:function(authors,author_id){
      var tag='';
      var i=0;
      while (i<authors.length){
        var  selected='';
        if (authors[i].id===author_id){
          selected=' selected'
        }
        tag= tag+ `<option value='${authors[i].id}'${selected}>${sanitizeHtml(authors[i].name)}</option>`;
        i++;
      }
      return `<p>
        <select name=author>${tag}</select>
        </p>`
    },*/
    /*authorTable:function(authors){
    var tag = '<table>';
    var i = 0;
    while(i < authors.length){
        tag += `
            <tr>
                <td>${sanitizeHtml(authors[i].name)}</td>
                <td>${sanitizeHtml(authors[i].profile)}</td>
                <td>update</td>
                <td><a href="/author/update?id=${authors[i].id}">update</a></td>
                <td>delete</td>
            </tr>
            `
        i++;
    }
    tag += '</table>';
    return tag;
  },*/
  /*authorTable:function(authors){
    var tag = '<table>';
    var i = 0;
    while(i < authors.length){
        tag += `
            <tr>
                <td>${sanitizeHtml(authors[i].name)}</td>
                <td>${sanitizeHtml(authors[i].profile)}</td>
                <td><a href="/author/update?id=${authors[i].id}">update</a></td>
                <td>
                  <form action="/author/delete_process" method="POST">
                  <input type="hidden" name="id" value="${authors[i].id}">  
                  <input type="submit" value="delete">
                  </form>
                </td>
            </tr>
            `
        i++;
    }
    tag += '</table>';
    return tag;
  }*/
}
//module.exports=template;
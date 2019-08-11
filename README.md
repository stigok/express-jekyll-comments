Can be used with this Jekyll comment plugin: <https://github.com/stigok/blog.stigok.com/blob/6e3e48916fb9d9c8010153433f62714bdcf19f57/_plugins/comments.rb>

This project works, but I won't be using it myself. Read my blog post for more info:
<https://blog.stigok.com/2019/02/23/jekyll-comments-working-but-not-great-development-story.html>

## Usage

```terminal
$ export hostname=127.0.0.1 port=3000 dbpath=/tmp/sqlite.db
$ node bin/www.js $hostname $port $dbpath
```

- `PUT /comments/<subject id>` containing `application/www-form-urlencoded` bodies with an `author` and a `body`.
- `GET /comments/<subject id>` to list all comments for subject `<id>`

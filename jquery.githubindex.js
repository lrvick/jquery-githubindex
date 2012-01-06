(function($) {
    $.fn.githubIndex = function(users, repos, callback) {
        var $el = this
        var feed = [];

        var getRepo = function() {
            var parts = repos.pop().split('/')
            var user = parts[0]
            var repo = parts[1]
            var repo_url = 'https://api.github.com/repos/' + user + '/' + repo + '?callback=?'
            $.getJSON(repo_url, function(data) {
                feed.push(data.data)
                getFeeds();
            })
        }

        var getUserRepos = function() {
            var user = users.pop();
            var user_url = 'https://api.github.com/users/' + user + '/repos?per_page=100&type=owner&callback=?'
            $.getJSON(user_url, function(data) {
                $.each(data.data, function(key, value) {
                    if (value['fork'] === false) {
                        feed.push(value)
                    }
                })
                getFeeds()
            })
        }

        var sortFeeds = function(feed) {
            feed.sort(function(a, b) {
                var date_a = new Date(a['pushed_at'])
                var date_b = new Date(b['pushed_at'])
                return date_b.getTime() - date_a.getTime();
            });
            return feed
        }

        var getFeeds = function() {
            if (repos.length > 0) {
                getRepo();
            } else if (users.length > 0) {
                getUserRepos();
            } else {
                feed = sortFeeds(feed);
                $.each(feed, function(key, value) {
                    var $article = $('<article>').appendTo($el)
                    var $h2 = $('<h2>').appendTo($article)
                    $('<a>')
                        .attr('href', value['html_url'])
                        .text(value['name'])
                        .appendTo($h2)
                    $('<p>')
                        .addClass('description')
                        .text(value['description'])
                        .appendTo($article)
                    var $dl = $('<dl>').appendTo($article)
                    $('<dt>')
                        .text('Last Updated:')
                        .appendTo($dl)
                    var $updated_dd = $('<dd>')
                        .appendTo($dl)
                    $('<time>')
                        .text(value['pushed_at'])
                        .appendTo($updated_dd)
                    if (value['language']){
                        $('<dt>')
                            .text('Primary Language:')
                            .appendTo($dl)
                        $('<dd>')
                            .text(value['language'])
                            .appendTo($dl)
                    }
                $('<dt>')
                    .text('Lines:')
                    .appendTo($dl)
                $('<dd>')
                    .text(value['size'])
                    .appendTo($dl)
                $('<dt>')
                    .text('Repo URL:')
                    .appendTo($dl)
                var $repo_dl = $('<dd>')
                    .appendTo($dl)
                $('<a>')
                    .attr('href', value['html_url'])
                    .text(value['html_url'])
                    .appendTo($repo_dl)
                })
                if (callback){
                    callback($el)
                }
            }
        }

        getFeeds();

        return this

    }
})(jQuery);


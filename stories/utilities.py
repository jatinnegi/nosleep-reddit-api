import praw
import prawcore
from decouple import config
import datetime

reddit = praw.Reddit(
    client_id=config('CLIENT_ID'),
    client_secret=config('CLIENT_SECRET'),
    user_agent=config('USER_AGENT'),
    username=config('USERNAME'),
    password=config('PASSWORD'),
)

subreddit = reddit.subreddit('nosleep')
LIMIT = 10


def get_submissions():
    submissions = []

    for submission in subreddit.hot(limit=LIMIT):
        if submission.distinguished == 'moderator':
            pass
        else:
            submissions.append(get_submission(submission))

    return submissions


def next_submissions(sort_by, page):
    new_limit = LIMIT * page
    start_index = new_limit - 10
    index = 1

    submissions = []

    if sort_by == 'hot':
        for submission in subreddit.hot(limit=new_limit):
            if index <= start_index:
                index = index + 1

            else:
                if submission.distinguished == 'moderator':
                    pass
                else:
                    submissions.append(get_submission(submission))

    elif sort_by == 'new':
        for submission in subreddit.new(limit=new_limit):
            if index <= start_index:
                index = index + 1

            else:
                if submission.distinguished == 'moderator':
                    pass
                else:
                    submissions.append(get_submission(submission))

    elif sort_by == 'top':
        for submission in subreddit.top(limit=new_limit):
            if index <= start_index:
                index = index + 1

            else:
                if submission.distinguished == 'moderator':
                    pass
                else:
                    submissions.append(get_submission(submission))

    else:
        pass

    return submissions


def get_submission(submission):
    posted_on = format_date(
        datetime.datetime.fromtimestamp(submission.created))

    return ({
        'title': submission.title,
        'score': submission.score,
        'author': submission.author.name,
        'flair': submission.link_flair_text,
            'id': submission.id,
            'posted_on': posted_on
            })


def get_submission_info(submission_id):
    try:
        submission = reddit.submission(submission_id)
        submission_dict = {}
        if submission.subreddit != 'nosleep':
            pass
        else:
            posted_on = format_date(
                datetime.datetime.fromtimestamp(submission.created))

            submission_dict['title'] = submission.title
            submission_dict['author'] = submission.author.name
            submission_dict['posted_on'] = posted_on
            submission_dict['selftext'] = format_selftext(submission.selftext)
            submission_dict['flair'] = submission.link_flair_text

        return submission_dict

    except prawcore.exceptions.NotFound:
        return {}
    except prawcore.exceptions.Forbidden:
        return {}


def search_submissions(search_value, page):
    limit = LIMIT * page
    start_index = limit - 10
    index = 1

    submissions = []

    for submission in subreddit.search(search_value, limit=limit):
        if index <= start_index:
            index = index + 1

        else:
            if submission.distinguished == 'moderator':
                pass
            else:
                submissions.append(get_submission(submission))

    return submissions


def format_date(timestamp):
    month_str = {
        1: "January",
        2: "February",
        3: "March",
        4: "April",
        5: "May",
        6: "June",
        7: "July",
        8: "August",
        9: "September",
        10: "October",
        11: "November",
        12: "December",
    }

    day = timestamp.day
    year = timestamp.year
    month = month_str.get(timestamp.month, 'undefined')

    date_str = f'{month} {day} {year}'

    return date_str


def format_selftext(selftext):
    paragraphs = selftext.split("\n")

    for count, paragraph in enumerate(paragraphs):
        paragraphs[count] = paragraphs[count].replace('&#x200B;', '')
        paragraphs[count] = paragraphs[count].replace('\\', '')
    return paragraphs

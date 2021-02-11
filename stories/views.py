from django.shortcuts import render
from .utilities import get_submissions, next_submissions, get_submission_info, search_submissions
import pprint
from django.http import JsonResponse
import json


def index(request):
    submissions = get_submissions()

    context = {
        'submissions': submissions,
    }

    return render(request, "stories/index.html", context)


def get_10_more_submissions(request, sort_by, page):
    submissions = next_submissions(sort_by, page)

    return JsonResponse(submissions, safe=False)


def get_submission(request, submission_id):

    submission = get_submission_info(submission_id)

    context = {
        'submission': submission
    }

    return render(request, "stories/submission.html", context)


def search(request):

    if request.method == 'POST':
        post_data = json.loads(request.body.decode('utf-8'))
        search_value = post_data['search']
        page = post_data['page']

        submissions = search_submissions(search_value, page)

        return JsonResponse(submissions, safe=False)

    return JsonResponse({}, safe=False)

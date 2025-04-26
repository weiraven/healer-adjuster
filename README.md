# Web Development Project 7 - *Healer Adjuster*

Submitted by: **Raven Wei**

This web app: **FFXIV raid planning perfected at a healer's expense.**

Time spent: **15** hours spent in total

## Required Features

The following **required** functionality is completed:

- [x] **Web app includes a create form that allows the user to create posts**
  - Form requires users to add a post title
  - Forms should have the *option* for users to add: 
    - additional textual content
    - an image added as an external image URL
- [x] **Web app includes a home feed displaying previously created posts**
  - Web app must include home feed displaying previously created posts
  - By default, each post on the posts feed should show only the post's:
    - creation time
    - title 
    - upvotes count
  - Clicking on a post should direct the user to a new page for the selected post
- [x] **Users can view posts in different ways**
  - Users can sort posts by either:
    -  creation time
    -  upvotes count
- [x] **Users can interact with each post in different ways**
  - The app includes a separate post page for each created post when clicked, where any additional information is shown, including:
    - content
    - image
    - comments
  - Each post includes an upvote button on the post page. 
    - Each click increases the post's upvotes count by one
    - Users can upvote any post any number of times
- [x] **A post that a user previously created can be edited or deleted from its post pages**
  - After a user creates a new post, they can go back and edit the post
  - A previously created post can be deleted from its post page

The following **optional** features are implemented:

- [x] Web app implements ACTUAL authentication.
  - Users can only edit and delete posts or delete comments by entering the secret key, which is set by the user during post creation
  - Only the original user author of a post can update or delete it

The following **additional** features are implemented:

- [x] Logged in users can create additional teams (statics) and add members to them.
- [x] Users can schedule events for their static using a calendar feature.

## Video Walkthrough

Here's a walkthrough of implemented user stories:

<img src='https://github.com/weiraven/healer-adjuster/blob/main/public/images/updated-demo.gif' title='Video Walkthrough' width='1000' alt='Video Walkthrough' />

GIF created with [ScreenToGif](https://www.screentogif.com/) for Windows

## License

    Copyright [2025] [Raven Wei]

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
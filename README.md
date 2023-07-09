# MailAway

MailAway is a Node.js-based app that allows you to automatically respond to emails sent to your Gmail mailbox while you are on vacation.

## Documentation Video

Check out the [Documentation Video](https://drive.google.com/file/d/1KamMscr81gYHXJy0KejcrBHLij8hDPUl/view?usp=sharing) for a detailed overview of the app.

## Libraries Used

- googleapis
- @google-cloud/local-auth

## API Documentation

- [Gmail API Reference](https://developers.google.com/gmail/api/reference/rest)
- [Gmail API Quickstart for Node.js](https://developers.google.com/gmail/api/quickstart/nodejs)

## Notes on Areas for Improvement

1. **Threaded Email Reply:** Currently, the automated reply is not received in the same thread by the receiver. To achieve this behavior, we need to include the body of previously sent emails in the thread as well. Refer to this [Stack Overflow post](https://stackoverflow.com/questions/58095862/gmail-api-include-previous-messages-in-the-reply#:~:text=It%20is%20not%20possible%20to,that%20appends%20the%20data%20after%20%3E%20.) for more information.

2. **Handling Multiple Senders, BCCs, and CCs:** The behavior of the app has not been thoroughly tested when multiple senders, BCCs, and CCs are involved in the email thread. Further testing and improvements may be needed to handle such scenarios effectively.

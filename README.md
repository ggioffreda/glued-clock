GluedJS - Clock
================

Easy way of adding a clock to your Glue ecosystem.

The clock will broadcast the messages listed below, with a maximum delay of 
166ms at most, plus bus latency. You can expect no more than 200-250ms on a 
decent network. The payload of the message is always the timestamp in
milliseconds, as returned by the `Date.now()` function.

List of topics and their frequency:

- **clock.minute.{YYYY].{MM}.{DD}.{HH}.{mm}** every minute

- **clock.hour.{YYYY].{MM}.{DD}.{HH}.{mm}** every hour

- **clock.day.{YYYY].{MM}.{DD}.{HH}.{mm}** every day

- **clock.dow.{day of week}** every day, the third level of the topic is one in:
  "monday", "tuesday", "wednesday", "thursday", "friday", "saturday",
  "sunday", all lowercase

- **clock.doy.{day of year}** every day, the third level of the topid is the day
  of the year (0-365)

- **clock.month.{month}** every month, the third level of the topic is one in:
  "january", "february", "march", "april", "may", "june", "july", "august",
  "september", "october", "november", "december", all lowercase

- **clock.year.{YYYY]** every year

Installation
------------

To run the service you can install with the `-g` flag and then run the
`glued-clock` command:

    $ npm install -g glued-clock
    $ glued-clock

The clock will try and connect to the AMQP message bus using the default
values, you can customise them by setting the *GLUED_AMQP* and 
*GLUED_MESSAGE_BUS* environment variables. You can find more information in the
[GluedJS - Common Utilities](https://github.com/ggioffreda/glued-common)
documentation.

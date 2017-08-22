# ifrcgo_react

# install

pip install django psycopg2 feedparser unicodecsv

npm install

# npm modules used in this project

(should be listed in package.json)
- sass
- semantic-ui
- babel/react
- webpack
- gulp


# Set up

Copy ifrc/settings.template and change as appropriate e.g. add database settings

# To start the dev server and watch file changes run:
```
gulp
```

If the command above doesn't work you can run the following two commands in separate windows:

```
python manage.py runserver
webpack --watch
```

/*****************************************************************
            SET-UP

******************************************************************/

var gulp = require('gulp-help')(require('gulp'));
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;


/*****************************************************************
            GULP TASKS:

    - Serving backend in dev mode
    - watching files

****************************************************************/

// serving python manage.py
gulp.task('serve:backend', function () {
    var projDir = 'E:\\GitHub\\ifrcgo_react\\'
    var devServerPort = process.env.PORT || 8000;
    process.env.PYTHONUNBUFFERED = 1;
    process.env.PYTHONDONTWRITEBITECODE = 1;
    spawn('python', [projDir + 'manage.py', 'runserver', '127.0.0.1:' + devServerPort], {
        stdio: 'inherit'
    });
});

// Generate minified bundle
gulp.task('webpack', function (cb) {
    exec('webpack', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});

// Starts webpack to watches files for any changes
gulp.task('webpack:watch', function(cb) {
    exec('webpack --watch', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});


gulp.task('default', function () {
    gulp.start('webpack');
    gulp.start('webpack:watch');
    gulp.start('serve:backend');
    //gulp.start('main:watch');
});


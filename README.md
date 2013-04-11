Wrap any JavaScript file in an [Aria Templates](http://ariatemplates.com) class definition.

It allows to create either plain classes or a singleton.

## Getting Started

This plugin requires [Grunt](http://gruntjs.com) ~0.4.4.

Install the plugin with `npm install grunt-at-class` or put it in your `package.json` and add the following line to your `Gruntfile.js`

````js
grunt.loadNpmTasks("grunt-eco-amd");
````

## The "at_class" task

`at_class` is a multitask that generates a JavaScript file with a class definition from a source file.

Task targets, files and options may be specified according to the grunt [Configuring tasks](http://gruntjs.com/configuring-tasks) guide.

## Overview

In your project's `Grunfile.js` add a section named `at_class` to the object passed to `grunt.initConfig()`.

````js
at_class: {
	myLibrary: {
		src: ['path/to/the/library/to/wrap.js'],
		dest: 'target/wrappedLibrary.js',
		options: {
			singleton: true,
			exports: "myLibrary",
			classpath: "wrapped.Library",
			license: "path/to/library/license"
		}
	}
}
````

### Options

#### classpath

[Classpath](http://ariatemplates.com/usermanual/Javascript_Classes) of the generated Aria Templates class.

#### singleton

Wheter the generated class should be a singleton. Defaults to `true`.

#### exports

Name of the variable exported by the wrapped script.

If the generated class is a singleton, this variable will be accessible at the specified classpath, otherwise it'll be used as a constructor when an instance of that classpath is created.

#### license

Optional license header to include along with the source code.



## Usage Examples

### singleton

Given the following library

````js
var trivial = (function () {
	return {
		getOne : function () {
			return 1;
		}
	}
})();
````

The following configuration
````js
at_class: {
	myLibrary: {
		src: ['somewhere/trivial.js'],
		dest: 'target/trivial.js',
		options: {
			exports: "trivial",
			classpath: "wrapped.TrivialLibrary"
		}
	}
}
````
generates a class that can be used like this
````js
Aria.load({
	classes : ["wrapped.TrivialLibrary"],
	oncomplete : function () {
		console.log(wrapped.TrivialLibrary.getOne());  // -> 1

		// trivial would be undefined
	}
})
````

### simple class

The task can be used also to generate plain classes, consider the following example

````js
var Useless = function (name) {
	this.name = name;
};

Useless.prototype.whoAmI = function () {
	return this.name;
};
````

The following configuration
````js
at_class: {
	myLibrary: {
		src: ['somewhere/useless.js'],
		dest: 'target/useless.js',
		options: {
			exports: "Useless",
			classpath: "wrapped.UselessLibrary",
			singleton: false
		}
	}
}
````
generates a class that can be used like this
````js
Aria.load({
	classes : ["wrapped.UselessLibrary"],
	oncomplete : function () {
		var robert = Aria.getClassInstance("wrapped.UselessLibrary", "Robert");
		var peter = Aria.getClassInstance("wrapped.UselessLibrary", "Peter");
		
		robert.whoAmI(); // -> Robert
		peter.whoAmI(); // -> Robert
	}
})
````


## Release History

### 0.1.0

* Creation of the project
* Support singleton and plain class
* Include license information

## License

This project is licensed under the Apache License v2.0. Read the license [here](https://github.com/ariatemplates/grunt-at-class/blob/master/LICENSE).
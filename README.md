# Cherry Stem

Collaborative markdown-driven note-taking platform

## Introduction

[cherry-markdown](https://github.com/Tencent/cherry-markdown) is a popular
browser-based markdown editing platform. Cherry Stem is a simple node app that
delivers it as a service, permitting one to take notes that are persistent.

The backend is sqlite. Requests for different database backends will be ignored.

## Quick Start

	~$ git clone https://github.com/wikitopian/cherry-stem
	~$ cd cherry-stem
	~$ npm install
	~$ npm run server

## Deployment

### Service Configuration

There is a `dot.env.example` file that's a template. You can copy its contents
to `.env` and modify them for your environment.

### Editor Configuration

There is a `cherry.options.default.json` file that's a template. You can copy
its contents to `cherry.options.json`, where your edits won't conflict with git.

These are the options for the Cherry Markdown editor. Please refer to that
separate project's documentation for configuration options.

### Nginx

Here's an example of an nginx reverse proxy configuration that successfully
handles the websocket.

	map $http_upgrade $connection_upgrade {
		default upgrade;
		'' close;
	}
	
	server {
		listen 80;
		server_name notes.example.com;
	 
		rewrite ^/(.*)$ https://notes.example.com/$1 permanent;
	}
	
	server {
		listen 443 ssl;
		server_name notes.example.com;
	
		ssl_certificate         ssl/example.com.pem;
		ssl_certificate_key     ssl/example.com.key;
	
		location ~ \.ws$ {
			proxy_http_version 1.1;
			proxy_set_header Upgrade $http_upgrade;
			proxy_set_header Connection $connection_upgrade;
			proxy_pass http://127.0.0.1:3000;
		}
	
		location / {
			proxy_pass http://127.0.0.1:3000/;
		}
	}

## Contributions

While an effort will be made to support and improve upon this service, and pull
requests will be reviewed and considered, this project is a personal one to
solve a personal problem. The reason I had to do this was that CodiMD doesn't
work on ARM64 architecture because it has too many dependencies, one of which
doesn't work on ARM64.

## To Do

 - [ ] File uploading
 - [ ] Differential refreshing (bit-sync?)
 - [ ] Line-level locking for collaboration
 - [ ] Optional password access/editing
 - [ ] Preview mode if no password and not hidden
 - [ ] Server-side refresh rate enforcement

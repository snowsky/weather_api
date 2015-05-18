run:
	slc run . & echo $$! > api.pid
	node app/app.js & echo $$! > web.pid

clean:
#	kill `ps aux|grep node|awk '{print $2}'`
	kill -9 `cat api.pid`
	kill -9 `cat web.pid`
	rm api.pid web.pid

.PHONY: run clean

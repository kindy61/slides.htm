.PHONY: all

all: sample-slides.html

%.slides: %.sld
	perl bin/pre.pl $< > $@

%.html: %.slides template/*
	perl bin/render-template $< $@

%.png: %.dot
	dot -Tpng $< > $@

%.dot: %.tt
	tpage $< > $@


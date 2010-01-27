
Introduction to
our X<VDOM.pm> & X<vdom-webkit> cluster

☺{{#author|agentzh@yahoo.cn}}☺
{{#author|章亦春 (agentzh)}}
{{#date|2009.9}}
----


  V<VDOM>

  ➥  X<Visual> DOM
  ➥  DOMs with CI<vision information>


----

  KW<window> KW<location>=X<"http://foo.bar.com/index.html">
             KW<innerHeight>=802 KW<innerWidth>=929
             KW<outerHeight>=943 KW<outerWidth>=1272 {
      KW<document> KW<width>=914 KW<height>=5119 {
          V<...>
      }
  }

----

    KW<BODY> KW<x>=0 KW<y>=0 KW<w>=914
             KW<h>=5119
             KW<fontFamily>="Helvetica,Arial,sans-serif"
             KW<fontSize>="12px" KW<fontStyle>="normal"
             KW<fontWeight>="400" KW<color>="rgb(0, 0, 0)"
             KW<backgroundColor>="rgb(255, 255, 255)" {
          X<"\\n  "> w=0 {
          }
          KW<DIV> KW<id>="append_parent" KW<x>=0 KW<y>=0
                  KW<h>=0 KW<backgroundColor>="transparent" {
              X<"首页\\n\\n"> KW<x>=1 KW<y>=1 {
                  V<...>
              }
          }
          X<"\\n  "> w=0 {
          }
    }

----

  KW<FONT> KW<color>="rgb(255, 0, 0)" {
    KW<B> KW<fontWeight>="401" {
      X<"购物"> KW<h>=32 KW<w>=56 {
      }
    }
  }

----

"Why CI<another> language?"
"Why X<not> just borrow HTML or XML's syntax?"

----

   CM<✓> We want to keep VDOM dump size CI<small>.
   CM<✓> We want to keep VDOM dump CI<unambiguous>.
   CM<✓> We want to make VDOM more X<human-readable> and more
         X<human-writable>.
         (Yeah, XML/HTML's syntax is very I<cumbersome>.)
   CM<✓> We want to make VDOM I<parsers> & I<dumper>
         CI<trivial> to implement and verify.
         (tens of lines of Perl for example ;))
   CM<✓> Low level structures like CI<text runs> and CI<text nodes>
         are hard to express naturally in HTML or XML.

----

X<☺> We've already made both
Mozilla X<Gecko> and Apple X<WebKit> I<emit> VDOMs

----
{{img src="images/gen-vdom.png"}}

----

 CM<# Generate VDOM from the command line:>
 V<$> CI<vdomkit> --enable-js --proxy=proxy.cn:1080 \\
        http://www.sina.com.cn > sina.vdom

 CM<# Or access our vdomkit FastCGI server directly by HTTP:>
 V<$> curl 'http://vdom.cn.yahoo.com/vdom?X<url=http%3A%2F%2Fwww.sina.com.cn>' \\
        > sina.vdom

----

 CM<# The VDOM dump is much smaller than the original HTML:>
 V<$> ls -lh CI<sina.vdom>
 -rw------- 1 agentz agentz X<278K> 2009-04-10 10:30 sina.vdom

 V<$> ls -lh CI<sina.html>
 -rw-r--r-- 1 agentz agentz X<400K> 2009-04-10 10:34 sina.html

----

CM<✓> Now CI<Perl> enjoys X<very powerful DOMs>
as good as those in JavaScript.

----

  KW<use> VDOM;
  KW<open my> V<$in>, X<"sina.vdom"> or die V<$!>;
  KW<my> V<$win> = VDOM::Window->new->parse_file(V<$in>);
  KW<my> V<$body> = V<$win>->document->body;
  KW<for my> V<$child> (V<$body>->childNodes) {
       print V<$child>->tagName;
       print V<$child>->x;
       print V<$child>->h;
       print V<$child>->color;
       print V<$child>->fontFamily;
       V<...>
  }

----

 print V<$child>->nextSibling;
 V<$win>->document->getElementById(X<"foo">);

 CM<# These are Firefox 3.1 DOM methods, we have too ;)>
 print V<$child>->previousElementSibling;
 print V<$child>->firstElementChild;

 print $child->parentNode;
 print KW<join> X<' '>,
    KW<map> { V<$$_>->href . X<': '> . V<$$_>->textContent }
        V<$child>->getElmenetsByTagName(X<"A">);

----
{{img src="images/vdom-pm.png"}}
----
{{img src="images/vdom-pm2.png"}}
----

CM<☺> I<Debug> our Perl code from within CI<Firefox>
via our X<Visual DOM> extension

----
{{img src="images/visualdom-ch.png"}}
----
{{img src="images/visualdom-ch-cfg.png"}}
----
{{img src="images/between-ff-perl.png"}}
----
{{img src="images/visualdom-lh.png"}}
----
{{img src="images/visualdom-lh-cfg.png"}}
----

CM<☺> The CI<qt-webkit port> of our X<Visual DOM> extension:
I<VDOM Browser>

----
{{img src="images/vdom-browser-config.png"}}
----
{{img src="images/ch-eeee.png"}}
----
{{img src="images/ch-bbs-big.png"}}
----
{{img src="images/ch-bbs-guided.png"}}
----
{{img src="images/between-vdombrowser-perl.png"}}
----
CM<☺> We can get geometry information of
every CI<text nodes> in the DOM!
----
{{img src="images/vb-text-nodes.png"}}
----
...or even as small as CI<text runs>!
(text run is the undividable component of a text node
which has no line breaks in it)
----
{{img src="images/vb-text-runs.png"}}
----

CM<☺> Put everything into a CI<cluster>.

----
{{img src="images/cluster-arch.png"}}
----
{{img src="images/vdomwebkit-farm.png"}}
----
{{img src="images/proxy-guts2.png"}}
----
{{img src="images/prefetcher-guts.png"}}
----
{{img src="images/memcacheq-guts.png"}}
----
CM<☺> Most of the components have been CI<opensourced>
----
 QtWebKit with CI<VDOM support>
  ➥  {{http://github.com/agentzh/vdomwebkit/}}
----
 vdomkit (CI<command-line> utility and CI<web> interface)
  ➥  {{http://github.com/agentzh/vdomkit/}}
----
 VDOM Browser
  ➥  {{http://github.com/agentzh/vdombrowser/}}
----
 VDOM.pm
  ➥  {{http://github.com/agentzh/vdompm/}}
----
 queue-size-aware version of CI<memcacheq>
  ➥  {{http://github.com/agentzh/memcacheq/}}
----
 Queue::Memcached::Buffered (a CI<Perl client> for memcacheq)
  ➥  {{http://github.com/agentzh/queue-memcached-buffered/}}
----

 X<Acknowledgements>

 X<☺>  haibo++ persuaded me to believe that the CI<separation> of browser
    rendering engines and our hunter extractors via VDOM dumping
    could give rise to CI<lots> of benefits.
 X<☺>  jianingy++ effectively CI<fired> the great WebKit craze in our team.
 X<☺>  xunxin++ CI<ported> Visual DOM extension's JavaScript VDOM dumper
    to qt-webkit C++ and did most of the hard work in CI<vdom-webkit>.
 X<☺>  xunxin++ CI<ported> patched sina's memcacheq to make it aware
    of queue sizes.
 X<☺>  mingyou++ shared a great deal of his CI<knowledge> of the WebKit
    internals with us and also gave very good suggestions for the
    slides you're browsing.

----

☺ CI<Any questions>? ☺

----


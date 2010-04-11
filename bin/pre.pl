use strict;
use warnings;

sub gen_wh {
    my $file = shift;
    my $out = `identify $file`;
    my $retval = '';
    if ($out =~ /\b(\d+)x(\d+)\b/) {
        my ($w, $h) = ($1, $2);
        $retval = qq{width="$w" height="$h"};
    }
    #warn $retval;
    return $retval;
}

my $firstTime = 1;
while (<>) {
    s/(X|CI|C|XI|I|KW|TAG|CM|V|KEY|ATT|T)<<(.*?)>>/'{{#' . lc($1) . "|$2}}"/ge;
    s/(X|CI|C|XI|I|KW|TAG|CM|V|KEY|ATT|T)<([^>]*)>/'{{#' . lc($1) . "|$2}}"/ge;
    s/\{\{img\s+src="([^"]+)"\}\}/"{{img src=\"$1\" " . gen_wh($1) . "}}"/ge;
    my $new;
    if (/\{\{img\s+/) {
        #$new = qq<{{img src="#" width="0" height="0"}}\n>;
        $firstTime = 0;
    }
    while (1) {
        if (/\G\{\{.*?\}\}/gcs) {
            $new .= $&;
        } elsif (/\G"/gcs) {
            $new .= '\\"';
            #warn $new;
        } elsif (/\G./gcs) {
            $new .= $&;
        } else {
            last;
        }
    }
    $new =~ s/^$/  /g;
    print $new;
}


Remove-Item './../yasmp/src/Data/Registry' -Recurse
Remove-Item './../yasmp/src/Data/User' -Recurse

Remove-Item './../yasmpseer/Data/Registry' -Recurse
Remove-Item './../yasmpseer/Data/total_sequence.json'

node './meta.mjs'
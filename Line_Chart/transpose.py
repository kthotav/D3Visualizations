import csv
from itertools import izip
a = izip(*csv.reader(open("EPC_2000_2010.csv", "rb")))

csv.writer(open("output.csv", "wb")).writerows(a)
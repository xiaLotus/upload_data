import re

table_list = ['K11-3F 區網(27)', 'K11-3F 區網(28)', 'K11-3F 區網(29)', 'K11-3F 區網(30)']


# 提取括號內數字
def extract_number(s):
    match = re.search(r'\((\d+)\)', s)
    return int(match.group(1)) if match else float('inf')

# 排序
sorted_list = sorted(table_list, key=extract_number)
print(sorted_list)
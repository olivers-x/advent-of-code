qjsc -e -o hello.c hello.js
cc -g -Wall -MMD -MF hello.o.d -Wno-array-bounds -Wno-format-truncation -fwrapv  -D_GNU_SOURCE -DCONFIG_VERSION=\"2024-02-14\" -DCONFIG_BIGNUM -DHAVE_CLOSEFROM -O2 -c -o hello.o hello.c -I./quickjs
cc -g -o hello hello.o ./quickjs/build/CMakeFiles/qjs.dir/quickjs.c.o ./quickjs/build/CMakeFiles/qjs.dir/libregexp.c.o ./quickjs/build/CMakeFiles/qjs.dir/libunicode.c.o ./quickjs/build/CMakeFiles/qjs.dir/cutils.c.o ./quickjs/build/CMakeFiles/qjs_exe.dir/quickjs-libc.c.o ./quickjs/build/CMakeFiles/qjs.dir/libbf.c.o -lm -ldl -lpthread -I./quickjs

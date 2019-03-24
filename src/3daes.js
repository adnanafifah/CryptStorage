var AES = (function () {
	function AES() {
        /*private*/ this.outputFile = "";
		this.tempKeyD = "";
		this.tempCodeD = "";
		this.outputc = "";
		this.outputh = "";
		this.tabFlag = 0;
        /*private*/ this.S_box = [[99, 124, 119, 123, 242, 107, 111, 197, 48, 1, 103, 43, 254, 215, 171, 118], [202, 130, 201, 125, 250, 89, 71, 240, 173, 212, 162, 175, 156, 164, 114, 192], [183, 253, 147, 38, 54, 63, 247, 204, 52, 165, 229, 241, 113, 216, 49, 21], [4, 199, 35, 195, 24, 150, 5, 154, 7, 18, 128, 226, 235, 39, 178, 117], [9, 131, 44, 26, 27, 110, 90, 160, 82, 59, 214, 179, 41, 227, 47, 132], [83, 209, 0, 237, 32, 252, 177, 91, 106, 203, 190, 57, 74, 76, 88, 207], [208, 239, 170, 251, 67, 77, 51, 133, 69, 249, 2, 127, 80, 60, 159, 168], [81, 163, 64, 143, 146, 157, 56, 245, 188, 182, 218, 33, 16, 255, 243, 210], [205, 12, 19, 236, 95, 151, 68, 23, 196, 167, 126, 61, 100, 93, 25, 115], [96, 129, 79, 220, 34, 42, 144, 136, 70, 238, 184, 20, 222, 94, 11, 219], [224, 50, 58, 10, 73, 6, 36, 92, 194, 211, 172, 98, 145, 149, 228, 121], [231, 200, 55, 109, 141, 213, 78, 169, 108, 86, 244, 234, 101, 122, 174, 8], [186, 120, 37, 46, 28, 166, 180, 198, 232, 221, 116, 31, 75, 189, 139, 138], [112, 62, 181, 102, 72, 3, 246, 14, 97, 53, 87, 185, 134, 193, 29, 158], [225, 248, 152, 17, 105, 217, 142, 148, 155, 30, 135, 233, 206, 85, 40, 223], [140, 161, 137, 13, 191, 230, 66, 104, 65, 153, 45, 15, 176, 84, 187, 22]];
        /*private*/ this.S_box_inverse = [[82, 9, 106, 213, 48, 54, 165, 56, 191, 64, 163, 158, 129, 243, 215, 251], [124, 227, 57, 130, 155, 47, 255, 135, 52, 142, 67, 68, 196, 222, 233, 203], [84, 123, 148, 50, 166, 194, 35, 61, 238, 76, 149, 11, 66, 250, 195, 78], [8, 46, 161, 102, 40, 217, 36, 178, 118, 91, 162, 73, 109, 139, 209, 37], [114, 248, 246, 100, 134, 104, 152, 22, 212, 164, 92, 204, 93, 101, 182, 146], [108, 112, 72, 80, 253, 237, 185, 218, 94, 21, 70, 87, 167, 141, 157, 132], [144, 216, 171, 0, 140, 188, 211, 10, 247, 228, 88, 5, 184, 179, 69, 6], [208, 44, 30, 143, 202, 63, 15, 2, 193, 175, 189, 3, 1, 19, 138, 107], [58, 145, 17, 65, 79, 103, 220, 234, 151, 242, 207, 206, 240, 180, 230, 115], [150, 172, 116, 34, 231, 173, 53, 133, 226, 249, 55, 232, 28, 117, 223, 110], [71, 241, 26, 113, 29, 41, 197, 137, 111, 183, 98, 14, 170, 24, 190, 27], [252, 86, 62, 75, 198, 210, 121, 32, 154, 219, 192, 254, 120, 205, 90, 244], [31, 221, 168, 51, 136, 7, 199, 49, 177, 18, 16, 89, 39, 128, 236, 95], [96, 81, 127, 169, 25, 181, 74, 13, 45, 229, 122, 159, 147, 201, 156, 239], [160, 224, 59, 77, 174, 42, 245, 176, 200, 235, 187, 60, 131, 83, 153, 97], [23, 43, 4, 126, 186, 119, 214, 38, 225, 105, 20, 99, 85, 33, 12, 125]];
        /*private*/ this.key = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        /*private*/ this.State = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
        /*private*/ this.sliceState = [[[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]], [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]], [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]], [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]];
        /*private*/ this.extend_key = (function (s) {
			var a = []; while (s-- > 0)
				a.push(0); return a;
		})(176);
        /*private*/ this.Rcon = [0, 1, 2, 4, 8, 16, 32, 64, 128, 27, 54];
	}
	AES.prototype.keyGeneration = function () {
		var KIRALOOPKEY = 0;
		var temp = [0, 0, 0, 0];
		for (var i = 0; i < 16; i++) {
			this.extend_key[i] = this.key[i];
		}
		;
		for (var i = 4; i < 44; i++) {
			for (var j = 0; j < 4; j++) {
				temp[j] = this.extend_key[(i - 1) * 4 + j];
			}
			;
			if (i % 4 === 0) {
				this.RotWord(temp);
				for (var j = 0; j < 4; j++) {
					temp[j] = this.SubWord(temp[j]);
					if (j === 0) {
						temp[j] = temp[j] ^ this.Rcon[(i / 4 | 0)];
					}
				}
				;
			}
			for (var j = 0; j < 4; j++) {
				this.extend_key[(i - 0) * 4 + j] = this.extend_key[(i - 4) * 4 + j] ^ temp[j];
				KIRALOOPKEY++;
				var buf = { str: "", toString: function () { return this.str; } };
			}
			;
		}
		;
	};
	AES.prototype.RotWord = function (temp) {
		var a;
		a = temp[0];
		temp[0] = temp[1];
		temp[1] = temp[2];
		temp[2] = temp[3];
		temp[3] = a;
	};
	AES.prototype.SubWord = function (a) {
		var x = (a / 16 | 0);
		var y = a % 16;
		return this.S_box[x][y];
	};
	AES.prototype.SubWord_inverse = function (a) {
		var x = (a / 16 | 0);
		var y = a % 16;
		return this.S_box_inverse[x][y];
	};
	AES.prototype.hexFormat = function (integer) {
		return ("0" + (Number(integer).toString(16))).slice(-2).toUpperCase()
	};
	AES.prototype.convertHexToString = function (hex) {
		var sb = { str: "", toString: function () { return this.str; } };
		var temp = { str: "", toString: function () { return this.str; } };
		var _loop_1 = function (i) {
			var output = hex.substring(i, (i + 2));
			var decimal = parseInt(output, 16);
            /* append */ (function (sb) { sb.str = sb.str.concat(String.fromCharCode(decimal)); return sb; })(sb);
            /* append */ (function (sb) { sb.str = sb.str.concat(decimal); return sb; })(temp);
		};
		for (var i = 0; i < hex.length - 1; i += 2) {
			_loop_1(i);
		}
		;
		return sb.str;
	};
	AES.prototype.binaryFormat = function (integer) {
		var buf = { str: "", toString: function () { return this.str; } };
		return buf.str;
	};
	AES.prototype.msgEncrypt = function () {
		var i = 0;
		for (var j = 0; j < 4; j++) {
			for (var k = 0; k < 4; k++) {
				this.State[k][j] = this.extend_key[i] ^ this.State[k][j];
				i++;
			}
			;
		}
		;
		for (var time = 1; time < 11; time++) {
			this.roundLoop(time);
		}
		;
	};
	AES.prototype.roundLoop = function (time) {
		for (var i = 0; i < 4; i++) {
			for (var j = 0; j < 4; j++) {
				this.State[j][i] = this.SubWord(this.State[j][i]);
			}
			;
		}
		;
		if (time !== 10) {
			this.MixColumn();
		}
		var k = 0;
		for (var i = 0; i < 4; i++) {
			for (var j = 0; j < 4; j++) {
				this.State[j][i] = this.State[j][i] ^ this.extend_key[time * 16 + k];
				k++;
			}
			;
		}
		;
	};
	AES.prototype.MixColumn = function () {
		var temp = (function (dims) {
			var allocate = function (dims) {
				if (dims.length == 0) {
					return 0;
				}
				else {
					var array = [];
					for (var i = 0; i < dims[0]; i++) {
						array.push(allocate(dims.slice(1)));
					}
					return array;
				}
			}; return allocate(dims);
		})([4, 4]);
		for (var i = 0; i < 4; i++) {
			temp[0][i] = this.Multi(this.State[0][i], 2) ^ this.Multi(this.State[1][i], 3) ^ this.Multi(this.State[2][i], 1) ^ this.Multi(this.State[3][i], 1);
			temp[1][i] = this.Multi(this.State[0][i], 1) ^ this.Multi(this.State[1][i], 2) ^ this.Multi(this.State[2][i], 3) ^ this.Multi(this.State[3][i], 1);
			temp[2][i] = this.Multi(this.State[0][i], 1) ^ this.Multi(this.State[1][i], 1) ^ this.Multi(this.State[2][i], 2) ^ this.Multi(this.State[3][i], 3);
			temp[3][i] = this.Multi(this.State[0][i], 3) ^ this.Multi(this.State[1][i], 1) ^ this.Multi(this.State[2][i], 1) ^ this.Multi(this.State[3][i], 2);
		}
		;
		for (var j = 0; j < 4; j++) {
			for (var k = 0; k < 4; k++) {
				this.State[k][j] = temp[k][j];
			}
			;
		}
		;
	};
	AES.prototype.Multi = function (a, b) {
		var temp = [0, 0, 0, 0, 0, 0, 0, 0];
		var flag = [0, 0, 0, 0, 0, 0, 0, 0];
		var c = b;
		for (var i = 0; i < 8; i++) {
			var c1 = void 0;
			var c2 = void 0;
			c1 = (c / 2 | 0);
			c2 = c % 2;
			if (c2 === 1) {
				flag[i] = 1;
			}
			else {
				flag[i] = 0;
			}
			c = c1;
			if (i === 0) {
				temp[i] = a;
			}
			else {
				temp[i] = temp[i - 1] * 2;
				if (temp[i] > 255) {
					temp[i] = (temp[i] % 256) ^ 27;
				}
			}
		}
		;
		a = 0;
		for (var i = 0; i < 8; i++) {
			a = a ^ (temp[i] * flag[i]);
		}
		;
		return a;
	};
	AES.prototype.msgDecrypt = function () {
		var i;
		var j;
		for (var l = 0; l < 4; l++) {
			for (var k = 0; k < 4; k++) {
			}
			;
		}
		;
		for (i = 0, j = 160; i < 4; i++) {
			for (var k = 0; k < 4; k++) {
				this.State[k][i] = this.extend_key[j] ^ this.State[k][i];
				j++;
			}
			;
		}
		;
		for (var time = 1; time < 11; time++) {
			this.roundLoop_inverse(time);
		}
		;
	};
	AES.prototype.roundLoop_inverse = function (time) {
		for (var j = 0; j < 4; j++) {
			for (var k = 0; k < 4; k++) {
				this.State[k][j] = this.SubWord_inverse(this.State[k][j]);
			}
			;
		}
		;
		var i = 0;
		for (var j = 0; j < 4; j++) {
			for (var k = 0; k < 4; k++) {
				this.State[k][j] = this.State[k][j] ^ this.extend_key[160 - time * 16 + i];
				i++;
			}
			;
		}
		;
		if (time !== 10) {
			this.MixColumn_inverse();
		}
	};
	AES.prototype.MixColumn_inverse = function () {
		var temp = (function (dims) {
			var allocate = function (dims) {
				if (dims.length == 0) {
					return 0;
				}
				else {
					var array = [];
					for (var i = 0; i < dims[0]; i++) {
						array.push(allocate(dims.slice(1)));
					}
					return array;
				}
			}; return allocate(dims);
		})([4, 4]);
		for (var i = 0; i < 4; i++) {
			temp[0][i] = this.Multi(this.State[0][i], 14) ^ this.Multi(this.State[1][i], 11) ^ this.Multi(this.State[2][i], 13) ^ this.Multi(this.State[3][i], 9);
			temp[1][i] = this.Multi(this.State[0][i], 9) ^ this.Multi(this.State[1][i], 14) ^ this.Multi(this.State[2][i], 11) ^ this.Multi(this.State[3][i], 13);
			temp[2][i] = this.Multi(this.State[0][i], 13) ^ this.Multi(this.State[1][i], 9) ^ this.Multi(this.State[2][i], 14) ^ this.Multi(this.State[3][i], 11);
			temp[3][i] = this.Multi(this.State[0][i], 11) ^ this.Multi(this.State[1][i], 13) ^ this.Multi(this.State[2][i], 9) ^ this.Multi(this.State[3][i], 14);
		}
		;
		for (var j = 0; j < 4; j++) {
			for (var k = 0; k < 4; k++) {
				this.State[k][j] = temp[k][j];
			}
			;
		}
		;
	};
	AES.prototype.getSlice = function (codeNum) {
		var i = 0;
		for (var j = 0; j < 4; j++) {
			for (var k = 0; k < 4; k++) {
				this.State[k][j] = codeNum[i];
				i++;
			}
			;
		}
		;
	};
	AES.prototype.getSlicetoCubeX = function (slice, codeNum) {
		var i = 0;
		for (var j = 0; j < 4; j++) {
			for (var k = 0; k < 4; k++) {
				this.sliceState[slice][k][j] = codeNum[i];
				i++;
			}
			;
		}
		;
	};
	AES.prototype.getSlicetoCubeY = function (slice, codeNum) {
		var i = 0;
		for (var j = 0; j < 4; j++) {
			for (var k = 0; k < 4; k++) {
				this.sliceState[k][slice][j] = codeNum[i];
				i++;
			}
			;
		}
		;
	};
	AES.prototype.getSlicetoCubeZ = function (slice, codeNum) {
		var i = 0;
		for (var j = 0; j < 4; j++) {
			for (var k = 0; k < 4; k++) {
				this.sliceState[k][j][slice] = codeNum[i];
				i++;
			}
			;
		}
		;
	};
	AES.prototype.getRotateSlice = function (axis) {
		var i = 0;
		switch ((axis)) {
			case 0:
				for (var j = 0; j < 4; j++) {
					for (var k = 0; k < 4; k++) {
						this.State[k][j] = this.sliceState[0][k][j];
						i++;
					}
					;
				}
				;
				break;
			case 1:
				for (var j = 0; j < 4; j++) {
					for (var k = 0; k < 4; k++) {
						this.State[3 - j][k] = this.sliceState[1][k][j];
						i++;
					}
					;
				}
				;
				break;
			case 2:
				for (var j = 0; j < 4; j++) {
					for (var k = 0; k < 4; k++) {
						this.State[3 - k][3 - j] = this.sliceState[2][k][j];
						i++;
					}
					;
				}
				;
				break;
			case 3:
				for (var j = 0; j < 4; j++) {
					for (var k = 0; k < 4; k++) {
						this.State[j][3 - k] = this.sliceState[3][k][j];
						i++;
					}
					;
				}
				;
				break;
		}
	};
	AES.prototype.outSlice = function (codeNum) {
		var i = 0;
		for (var j = 0; j < 4; j++) {
			for (var k = 0; k < 4; k++) {
				codeNum[i] = this.State[k][j];
				i++;
			}
			;
		}
		;
	};
	AES.prototype.outRotateSlice = function (slice, codeNum) {
		var i = 0;
		switch ((slice)) {
			case 0:
				for (var j = 0; j < 4; j++) {
					for (var k = 0; k < 4; k++) {
						codeNum[i] = this.State[k][j];
						i++;
					}
					;
				}
				;
				break;
			case 1:
				for (var j = 3; j >= 0; j--) {
					for (var k = 0; k < 4; k++) {
						codeNum[i] = this.State[j][k];
						i++;
					}
					;
				}
				;
				break;
			case 2:
				for (var j = 3; j >= 0; j--) {
					for (var k = 3; k >= 0; k--) {
						codeNum[i] = this.State[k][j];
						i++;
					}
					;
				}
				;
				break;
			case 3:
				for (var j = 0; j < 4; j++) {
					for (var k = 3; k >= 0; k--) {
						codeNum[i] = this.State[j][k];
						i++;
					}
					;
				}
				;
				break;
		}
	};
	AES.prototype.outSlicetoCube = function (slice, codeNum) {
		var i = 0;
		for (var j = 0; j < 4; j++) {
			for (var k = 0; k < 4; k++) {
				this.sliceState[slice][k][j] = codeNum[i];
				i++;
			}
			;
		}
		;
	};
	AES.prototype.getKey = function (keyNum) {
		for (var i = 0; i < 16; i++) {
			this.key[i] = 0;
		}
		;
		for (var j = 0; j < 4; j++) {
			for (var k = 0; k < 4; k++) {
				this.State[k][j] = 0;
			}
			;
		}
		;
		for (var i = 0; i < 16; i++) {
			this.key[i] = keyNum[i] ^ this.key[i];
		}
		;
	};
	AES.prototype.inEnX = function () {
		var KIRALOOPMSG = 0;
		var KIRALOOPMSGc = 0;
		var y;
		var i;
		var j;
		var codeNum = (function (s) {
			var a = []; while (s-- > 0)
				a.push(0); return a;
		})(16);
		var keyNum = (function (s) {
			var a = []; while (s-- > 0)
				a.push(0); return a;
		})(16);
		var tempKey = this.tempKeyD;
		var tempCode = this.tempCodeD;
		var lengthKey = tempKey.length;
		var lengthCode = tempCode.length;
		if (lengthKey % 16 !== 0) {
			for (i = lengthKey % 16; i < 16; i++) {
				tempKey += " ";
			}
			;
		}
		for (i = 0, j = 0; j < tempKey.length; j++ , i++) {
			KIRALOOPMSG++;
			keyNum[i] = (tempKey.charAt(i)).charCodeAt(0);
			if (i === 15) {
				this.getKey(keyNum);
				i = -1;
			}
		}
		;
		this.keyGeneration();
		if (lengthCode % 64 !== 0) {
			for (i = lengthCode % 64; i < 64; i++) {
				tempCode += " ";
			}
			;
		}
		var s;
		var progress = tempCode.length;
		for (s = 0, y = 0, i = 0, j = 0; j < tempCode.length; j++ , i++) {
			KIRALOOPMSGc++;
			codeNum[i] = ((tempCode.charAt(j))).charCodeAt(0);
			if (i === 15) {
				switch ((y)) {
					case 0:
						this.getSlicetoCubeX(0, codeNum);
						y++;
						break;
					case 1:
						this.getSlicetoCubeX(1, codeNum);
						;
						y++;
						break;
					case 2:
						this.getSlicetoCubeX(2, codeNum);
						;
						y++;
						break;
					case 3:
						this.getSlicetoCubeX(3, codeNum);
						y = 0;
						s++;
						for (var slice = 0; slice < 4; slice++) {
							this.getRotateSlice(slice);
							this.msgEncrypt();
							this.outSlice(codeNum);
							for (i = 0; i < 16; i++) {
								this.outputc += String.fromCharCode(codeNum[i])[0];
								this.outputh += this.hexFormat(codeNum[i]);
							}
							;
						}
						;
						break;
				}
				i = -1;
			}
		}
		;
	};
	AES.prototype.inDeX = function () {
		var x;
		var i;
		var j;
		var codeNum = (function (s) {
			var a = []; while (s-- > 0)
				a.push(0); return a;
		})(16);
		var keyNum = (function (s) {
			var a = []; while (s-- > 0)
				a.push(0); return a;
		})(16);
		var tempKey = this.tempKeyD;
		var tempCode = this.tempCodeD;
		var lengthKey = tempKey.length;
		var lengthCode = tempCode.length;
		if (lengthKey % 16 !== 0) {
			for (i = lengthKey % 16; i < 16; i++) {
				tempKey += " ";
			}
			;
		}
		for (i = 0, j = 0; j < tempKey.length; j++ , i++) {
			keyNum[i] = (tempKey.charAt(i)).charCodeAt(0);
			if (i === 15) {
				this.getKey(keyNum);
				i = -1;
			}
		}
		;
		this.keyGeneration();
		if (lengthCode % 64 !== 0) {
			for (i = lengthCode % 64; i < 64; i++) {
				tempCode += " ";
			}
			;
		}
		var t = 0;
		var progress = tempCode.length;
		for (x = 0, i = 0, j = 0; j < tempCode.length; j++ , i++) {
			codeNum[i] = ((tempCode.charAt(j))).charCodeAt(0);
			if (i === 15) {
				this.getSlice(codeNum);
				this.msgDecrypt();
				switch ((x)) {
					case 0:
						this.outRotateSlice(0, codeNum);
						this.outSlicetoCube(0, codeNum);
						x++;
						break;
					case 1:
						this.outRotateSlice(1, codeNum);
						this.outSlicetoCube(1, codeNum);
						x++;
						break;
					case 2:
						this.outRotateSlice(2, codeNum);
						this.outSlicetoCube(2, codeNum);
						x++;
						break;
					case 3:
						this.outRotateSlice(3, codeNum);
						this.outSlicetoCube(3, codeNum);
						for (var jj = 0; jj < 4; jj++) {
							for (var kk = 0; kk < 4; kk++) {
								for (var ll = 0; ll < 4; ll++) {
									this.outputc += String.fromCharCode(this.sliceState[jj][ll][kk])[0];
								}
								;
							}
							;
						}
						;
						x = 0;
						break;
				}
				i = -1;
			}
		}
		;
	};
	AES.prototype.inEnY = function () {
		var KIRALOOPMSG = 0;
		var KIRALOOPMSGc = 0;
		var y;
		var i;
		var j;
		var codeNum = (function (s) {
			var a = []; while (s-- > 0)
				a.push(0); return a;
		})(16);
		var keyNum = (function (s) {
			var a = []; while (s-- > 0)
				a.push(0); return a;
		})(16);
		var tempKey = this.tempKeyD;
		var tempCode = this.tempCodeD;
		var lengthKey = tempKey.length;
		var lengthCode = tempCode.length;
		if (lengthKey % 16 !== 0) {
			for (i = lengthKey % 16; i < 16; i++) {
				tempKey += " ";
			}
			;
		}
		for (i = 0, j = 0; j < tempKey.length; j++ , i++) {
			KIRALOOPMSG++;
			keyNum[i] = (tempKey.charAt(i)).charCodeAt(0);
			if (i === 15) {
				this.getKey(keyNum);
				i = -1;
			}
		}
		;
		this.keyGeneration();
		if (lengthCode % 64 !== 0) {
			for (i = lengthCode % 64; i < 64; i++) {
				tempCode += " ";
			}
			;
		}
		var s;
		var progress = tempCode.length;
		for (s = 0, y = 0, i = 0, j = 0; j < tempCode.length; j++ , i++) {
			KIRALOOPMSGc++;
			codeNum[i] = ((tempCode.charAt(j))).charCodeAt(0);
			if (i === 15) {
				switch ((y)) {
					case 0:
						this.getSlicetoCubeY(0, codeNum);
						y++;
						break;
					case 1:
						this.getSlicetoCubeY(1, codeNum);
						;
						y++;
						break;
					case 2:
						this.getSlicetoCubeY(2, codeNum);
						;
						y++;
						break;
					case 3:
						this.getSlicetoCubeY(3, codeNum);
						y = 0;
						s++;
						for (var slice = 0; slice < 4; slice++) {
							this.getRotateSlice(slice);
							this.msgEncrypt();
							this.outSlice(codeNum);
							for (i = 0; i < 16; i++) {
								this.outputc += String.fromCharCode(codeNum[i])[0];
								this.outputh += this.hexFormat(codeNum[i]);
							}
							;
						}
						;
						break;
				}
				i = -1;
			}
		}
		;
	};
	AES.prototype.inDeY = function () {
		var x;
		var i;
		var j;
		var codeNum = (function (s) {
			var a = []; while (s-- > 0)
				a.push(0); return a;
		})(16);
		var keyNum = (function (s) {
			var a = []; while (s-- > 0)
				a.push(0); return a;
		})(16);
		var tempKey = this.tempKeyD;
		var tempCode = this.tempCodeD;
		var lengthKey = tempKey.length;
		var lengthCode = tempCode.length;
		if (lengthKey % 16 !== 0) {
			for (i = lengthKey % 16; i < 16; i++) {
				tempKey += " ";
			}
			;
		}
		for (i = 0, j = 0; j < tempKey.length; j++ , i++) {
			keyNum[i] = (tempKey.charAt(i)).charCodeAt(0);
			if (i === 15) {
				this.getKey(keyNum);
				i = -1;
			}
		}
		;
		this.keyGeneration();
		if (lengthCode % 64 !== 0) {
			for (i = lengthCode % 64; i < 64; i++) {
				tempCode += " ";
			}
			;
		}
		var t = 0;
		var progress = tempCode.length;
		for (x = 0, i = 0, j = 0; j < tempCode.length; j++ , i++) {
			codeNum[i] = ((tempCode.charAt(j))).charCodeAt(0);
			if (i === 15) {
				this.getSlice(codeNum);
				this.msgDecrypt();
				switch ((x)) {
					case 0:
						this.outRotateSlice(0, codeNum);
						this.outSlicetoCube(0, codeNum);
						x++;
						break;
					case 1:
						this.outRotateSlice(1, codeNum);
						this.outSlicetoCube(1, codeNum);
						x++;
						break;
					case 2:
						this.outRotateSlice(2, codeNum);
						this.outSlicetoCube(2, codeNum);
						x++;
						break;
					case 3:
						this.outRotateSlice(3, codeNum);
						this.outSlicetoCube(3, codeNum);
						for (var jj = 0; jj < 4; jj++) {
							for (var kk = 0; kk < 4; kk++) {
								for (var ll = 0; ll < 4; ll++) {
									this.outputc += String.fromCharCode(this.sliceState[ll][jj][kk])[0];
								}
								;
							}
							;
						}
						;
						x = 0;
						break;
				}
				i = -1;
			}
		}
		;
	};
	AES.prototype.inEnZ = function () {
		var KIRALOOPMSG = 0;
		var KIRALOOPMSGc = 0;
		var y;
		var i;
		var j;
		var codeNum = (function (s) {
			var a = []; while (s-- > 0)
				a.push(0); return a;
		})(16);
		var keyNum = (function (s) {
			var a = []; while (s-- > 0)
				a.push(0); return a;
		})(16);
		var tempKey = this.tempKeyD;
		var tempCode = this.tempCodeD;
		var lengthKey = tempKey.length;
		var lengthCode = tempCode.length;
		if (lengthKey % 16 !== 0) {
			for (i = lengthKey % 16; i < 16; i++) {
				tempKey += " ";
			}
			;
		}
		for (i = 0, j = 0; j < tempKey.length; j++ , i++) {
			KIRALOOPMSG++;
			keyNum[i] = (tempKey.charAt(i)).charCodeAt(0);
			if (i === 15) {
				this.getKey(keyNum);
				i = -1;
			}
		}
		;
		this.keyGeneration();
		if (lengthCode % 64 !== 0) {
			for (i = lengthCode % 64; i < 64; i++) {
				tempCode += " ";
			}
			;
		}
		var s;
		var progress = tempCode.length;
		for (s = 0, y = 0, i = 0, j = 0; j < tempCode.length; j++ , i++) {
			KIRALOOPMSGc++;
			codeNum[i] = ((tempCode.charAt(j))).charCodeAt(0);
			if (i === 15) {
				switch ((y)) {
					case 0:
						this.getSlicetoCubeZ(0, codeNum);
						y++;
						break;
					case 1:
						this.getSlicetoCubeZ(1, codeNum);
						;
						y++;
						break;
					case 2:
						this.getSlicetoCubeZ(2, codeNum);
						;
						y++;
						break;
					case 3:
						this.getSlicetoCubeZ(3, codeNum);
						y = 0;
						s++;
						for (var slice = 0; slice < 4; slice++) {
							this.getRotateSlice(slice);
							this.msgEncrypt();
							this.outSlice(codeNum);
							for (i = 0; i < 16; i++) {
								this.outputc += String.fromCharCode(codeNum[i])[0];
								this.outputh += this.hexFormat(codeNum[i]);
							}
							;
						}
						;
						break;
				}
				i = -1;
			}
		}
		;
	};
	AES.prototype.inDeZ = function () {
		var x;
		var i;
		var j;
		var codeNum = (function (s) {
			var a = []; while (s-- > 0)
				a.push(0); return a;
		})(16);
		var keyNum = (function (s) {
			var a = []; while (s-- > 0)
				a.push(0); return a;
		})(16);
		var tempKey = this.tempKeyD;
		var tempCode = this.tempCodeD;
		var lengthKey = tempKey.length;
		var lengthCode = tempCode.length;
		var output = "";
		if (lengthKey % 16 !== 0) {
			for (i = lengthKey % 16; i < 16; i++) {
				tempKey += " ";
			}
			;
		}
		for (i = 0, j = 0; j < tempKey.length; j++ , i++) {
			keyNum[i] = (tempKey.charAt(i)).charCodeAt(0);
			if (i === 15) {
				this.getKey(keyNum);
				i = -1;
			}
		}
		;
		this.keyGeneration();
		if (lengthCode % 64 !== 0) {
			for (i = lengthCode % 64; i < 64; i++) {
				tempCode += " ";
			}
			;
		}
		var t = 0;
		var progress = tempCode.length;
		for (x = 0, i = 0, j = 0; j < tempCode.length; j++ , i++) {
			codeNum[i] = ((tempCode.charAt(j))).charCodeAt(0);
			if (i === 15) {
				this.getSlice(codeNum);
				this.msgDecrypt();
				switch ((x)) {
					case 0:
						this.outRotateSlice(0, codeNum);
						this.outSlicetoCube(0, codeNum);
						x++;
						break;
					case 1:
						this.outRotateSlice(1, codeNum);
						this.outSlicetoCube(1, codeNum);
						x++;
						break;
					case 2:
						this.outRotateSlice(2, codeNum);
						this.outSlicetoCube(2, codeNum);
						x++;
						break;
					case 3:
						this.outRotateSlice(3, codeNum);
						this.outSlicetoCube(3, codeNum);
						for (var jj = 0; jj < 4; jj++) {
							for (var kk = 0; kk < 4; kk++) {
								for (var ll = 0; ll < 4; ll++) {
									this.outputc += String.fromCharCode(this.sliceState[ll][kk][jj])[0];
								}
								;
							}
							;
						}
						;
						x = 0;
						break;
				}
				i = -1;
			}
		}
		;
	};
	return AES;
}());
AES["__class"] = "AES";

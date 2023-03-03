const {MerkleTree} = require('merkletreejs')
const kecccak256 = require('keccak256')

let whiteListAddress = [
    "0x5F12C3e92E008A076315f110f798AA579c2d732b",
    "0xe725D38CC421dF145fEFf6eB9Ec31602f95D8097",
    "0xD9478B7cf6C4ACD11e90701Aa6C335B93a2C2368"
]

// 通过merkletree构造树对象
const leafNodes = whiteListAddress.map(addr=>kecccak256(addr));
const merkleTree = new MerkleTree(leafNodes, kecccak256,{sortPairs:true})
console.log(merkleTree.toString())

let addr = leafNodes[0]
// 获取addr的neighbor和 另一边的parent node
const hexProof = merkleTree.getHexProof(addr);
console.log(hexProof)
import pcap from 'pcap';

const dos = () => {
    const pcapsession = pcap.createSession('en0', 'tcp');

    pcapsession.on('packet', (raw_pcacket) => {
        console.log(raw_pcacket);
    })

}



export default dos;
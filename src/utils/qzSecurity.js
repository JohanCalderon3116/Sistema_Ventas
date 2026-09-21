import { KJUR, KEYUTIL, hextob64 } from "jsrsasign";
import qz from "qz-tray";

const CERT_B64 = `MIIDPTCCAiWgAwIBAgIUERNCx3MKbu6Mfl+sPbRjmA5tnCAwDQYJKoZIhvcNAQEL
BQAwLjEXMBUGA1UEAwwOU29mdENyZWF0ZSBQT1MxEzARBgNVBAoMClNvZnRDcmVh
dGUwHhcNMjYwOTIxMDE1NjE4WhcNMzYwOTE4MDE1NjE4WjAuMRcwFQYDVQQDDA5T
b2Z0Q3JlYXRlIFBPUzETMBEGA1UECgwKU29mdENyZWF0ZTCCASIwDQYJKoZIhvcN
AQEBBQADggEPADCCAQoCggEBANYSzuWvt/BiCFKfsB4NPS/J6/cfTrq7RwkhUCWp
QeNFSc3xMSM19vJ9/AzX5aBhJWjueBaR2inxcb04AqI5pkMUBnilMnkJT0IOQ3xR
swwiSHudLsybKrxswUiII63mNw1sPqFc02tHfZCpbnTK1OuHlrWdjfN1vQBd+CXg
XTFoCDBHllagUICBRlRysZ1y0Q9Xn9Hhilmr3zfjZcSdkJcWK9R2HNvWl5U1+Nz0
phmR/Bs7OQkdNP1Sc6uSoqZ9f+GZwJpDSnP+wvpAaS1MbX/1Ws5kntSaqFq9Hk42
C42Jog5ihO7QIi12u/KpAoaISeGdNiKtOjmAge+2j+jdCmMCAwEAAaNTMFEwHQYD
VR0OBBYEFLVeQPrwioFAlk0WrlHFezQrjMXzMB8GA1UdIwQYMBaAFLVeQPrwioFA
lk0WrlHFezQrjMXzMA8GA1UdEwEB/wQFMAMBAf8wDQYJKoZIhvcNAQELBQADggEB
ADRdF8++ZUlFLObCa0Aw7OWXbsMwl8JSHCGJjNuXIWyunRnn/Jdi4Z93gqqpdTiQ
3dq9j0HXA50qv93/RSzqlYJdPVawWtcNvQb0f2k0fM6TdQfpabZ/1NLsSeXCgUHm
kP9Itz8QC2aeHuD+lkiH0YjpWITEjyF/RZLHe1kmNqWV/JFsKD4X0yQ8PllqFkI5
JgrMuiADnWy9ojwdAnxCEo9iyGN9sJH5+3z814YHEN8lyAYcCeSDV5s0aHbpp3j+
VFgFSRV3OKbsMhcw6BBx10foNmwMLaXxCv9oW/hlw2dAx5yQvsu2mp7lHBicRVnM
P8U2NmxzTxYXi3DgBsTjW24=`;
const KEY_B64 = `MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDWEs7lr7fwYghS
n7AeDT0vyev3H066u0cJIVAlqUHjRUnN8TEjNfbyffwM1+WgYSVo7ngWkdop8XG9
OAKiOaZDFAZ4pTJ5CU9CDkN8UbMMIkh7nS7Mmyq8bMFIiCOt5jcNbD6hXNNrR32Q
qW50ytTrh5a1nY3zdb0AXfgl4F0xaAgwR5ZWoFCAgUZUcrGdctEPV5/R4YpZq983
42XEnZCXFivUdhzb1peVNfjc9KYZkfwbOzkJHTT9UnOrkqKmfX/hmcCaQ0pz/sL6
QGktTG1/9VrOZJ7UmqhavR5ONguNiaIOYoTu0CItdrvyqQKGiEnhnTYirTo5gIHv
to/o3QpjAgMBAAECggEAQ42x3odh6yh0aeZchE83NMJqhRRLGuAIXZg2m3va/+YY
kTWAhRT9da5OAJuMqdyeGovON4kVKFE5zDVFl33LurUyCZZP5CQM79Jid3OspbKX
3vJOF2ELzmQfZk0XvUO9sa2r4e3SBbOMqz7cTVzIbf7ejzdF2UMZPmlo6kLwBauz
axTCGsggtxQTLQyfVz8C4LCE/coLBg+SFyN178XNImK1BIYXaQ8VMJI5QzlcALOB
v+8etn08kWb6ro20dq+IqzdjHDVmtwZZ7rBLfArLdHAGWQA7z4vahaw4FXIwhylc
F6ZdRrCHUE1SFRS+ODmxkvlbaPydVkKOmRiR4BagSQKBgQD8CXXiDpR5krO3I4UC
HKAU6wWxLdOhIdLXYgRPa0xoBX1X43zLBu5wXvxUfm2qvvf+aY1wADk/Jl4ZzbDa
Y1UZO+NhQAI41zNtMNGKola/zm4tMLTTdPWD0dIAsdvRUuQkvqewu8+NGdGN6gBk
+oTwSyEmL1uIONxhNWeB8j3mnwKBgQDZcIfwOVAdAElkDOv/S/Zrr2zCp/pXyB/V
dV/F/BXXf+KizuHTeE852IPEQ1xyTFwkchq7ojYaeN78FJ1tjDprcN4qU/jQ/cqe
IFoobQy7xv+ysnAyKuEwpZpGTZWoMghKqJCR0AavVWqy79qx9aCrwrBrLQPa8JZm
3mPc+TPZvQKBgQDuoXp2zb0wmoEEHmJaDIZZJ+kcx7n/b0n02f4gwAP43XG/HEnU
5TwvMxAQZCArsWKXBJOA/wU00Hv6THFtZO121ehE9NjlvoQXl0hezbP7KVXR/bLI
H44yACCovb3WJHiUfdvCDyDFhTOO/YbgFP53kXrSb7ZndQbcFzdoptaLGwKBgElP
d4W2zRv6DMR+1tKsedi0vKakm/Mcth7yA+hspbCSnYbm2ZzC43NNXJ+/VlvzAt4G
2pyIhFVIi2XSTYGx1cCDvWPoC+vqpXXK0pruqWxmG6/UGZ/QdTxBmVI6tkqPE9yY
GKYQzTAwTFkoJUP63MEMUw7Pjo0ysILeWC0YmDLBAoGBAOjc7I0pGBkMYliRqHi5
5EGp2l7nBYsXyb9dygNoQKSNtGRAjHTVqVEPOj8sEwQ+cwMtSv+r7Ltut4iOYByB
0NpsXGSeCqJeW9wXT4tpCUGObvY+xPTcXq3ySH02gA5TPJve1ZGwTu/eWWdJzJdC
G5ouvRaUgNnpdXb73XIgks2B`;

const toPem = (b64, label) => {
  const body = b64
    .replace(/\s+/g, "")
    .match(/.{1,64}/g)
    .join("\n");
  return `-----BEGIN ${label}-----\n${body}\n-----END ${label}-----`;
};

const CERT = toPem(CERT_B64, "CERTIFICATE");
const PRIVATE_KEY = toPem(KEY_B64, "PRIVATE KEY");

export function configurarFirmaQZ() {
  qz.security.setCertificatePromise((resolve) => resolve(CERT));
  qz.security.setSignatureAlgorithm("SHA512");
  qz.security.setSignaturePromise((toSign) => (resolve, reject) => {
    try {
      const key = KEYUTIL.getKey(PRIVATE_KEY);
      const sig = new KJUR.crypto.Signature({ alg: "SHA512withRSA" });
      sig.init(key);
      sig.updateString(toSign);
      resolve(hextob64(sig.sign()));
    } catch (e) {
      console.error("Error firmando QZ:", e);
      reject(e);
    }
  });
}

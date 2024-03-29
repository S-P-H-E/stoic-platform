"use client"

import {FcGoogle} from "react-icons/fc"
import {FaMicrosoft} from "react-icons/fa"
import {ButtonShad} from "./ui/buttonshad";
import {FaXTwitter} from "react-icons/fa6";
import {GoogleAuthProvider, OAuthProvider, signInWithPopup, TwitterAuthProvider} from "firebase/auth";
import {auth, db} from "@/utils/firebase";
import {message} from "antd";
import {useRouter} from "next/navigation";
import {collection, doc, getDoc, getDocs, query, setDoc, where} from "firebase/firestore";
import {convertToAsciiEquivalent} from "@/utils/utils";

const Social = () => {
    const router = useRouter()

    const googleProvider = new GoogleAuthProvider();
    const twitterProvider = new TwitterAuthProvider()
    const microsoftProvider = new OAuthProvider('microsoft.com');

    const createCustomerIfNullOnRegister = async (userName: string | undefined | null, userEmail: string | null | undefined, userStripeId?: string | null) => {
        if (userName && userEmail && !userStripeId) {
            const response = await fetch('/api/stripe/create-customer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userName,
                    userEmail,
                    userStripeId,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to create customer');
            }

            const data = await response.json();

            const { customerId, hasSubscription } = data;

            return { customerId, hasSubscription }
        } else {
            return null;
            // console.log("STRIPE CREDENTIALS ERROR");
        }
    };

    const generateUniqueDocumentId = async (baseId: string) => {
        let suffix = 1;
        let uniqueId = baseId;

        while (true) {
            const existingDoc = await getDoc(doc(db, 'users', uniqueId));

            if (!existingDoc.exists()) {
                break;
            }

            // Increment the suffix and try again
            suffix++;
            uniqueId = `${baseId}_${suffix}`;
        }

        return uniqueId;
    };

    const onClick = async (provider: "google" | "microsoft" | "twitter") => {
        try {

            if (provider === 'google') {
                await signInWithPopup(auth, googleProvider);
            } else if (provider === 'twitter') {
                await signInWithPopup(auth, twitterProvider);
            } /*else if (provider === 'microsoft') {
                await signInWithPopup(auth, microsoftProvider);
            }*/

            // Check for the existence of the "custom" field
            const user = auth.currentUser;
            const userRef = collection(db, 'users');
            const q = query(userRef,
                where('email', '==', user?.email),
                where('custom', '==', true)
            );

            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {

                const sanitizedName = convertToAsciiEquivalent(user?.displayName || '')

                if (!sanitizedName) {
                    return {error: 'There is an issue with your name, can you try another name?'}
                }

                const uniqueId = await generateUniqueDocumentId(sanitizedName);

/*                const userStripeId = null

                const response = await createCustomerIfNullOnRegister(user?.displayName, user?.email, userStripeId)

                const { customerId, hasSubscription } = response!;*/

                const userData = {
                    name: user?.displayName,
                    email: user?.email,
                    photoUrl: user?.photoURL,
                    uid: user?.uid,
                    emailVerified: user?.emailVerified,
                    createdAt: user?.metadata.creationTime,
                    onboarding: true,
                    custom: true,
                    status: 'user',
                    /*stripe_customer_id: customerId*/
                }

                const userRef = doc(db, "users", uniqueId);
                await setDoc(userRef, userData);
            }

            router.push('/dashboard');
        } catch (err) {
            message.error("Error signing in");
/*
            console.log(err)
*/
        }
    }

    return (
        <div className="flex items-center w-full gap-x-2">
            <ButtonShad size="lg" className="w-full bg-black/50 active:scale-90 transition" variant="outline" onClick={() => onClick("twitter")}>
                <FaXTwitter className="text-white h-5 w-5"/>
            </ButtonShad>

            <ButtonShad size="lg" className="w-full bg-black/50 active:scale-90 transition" variant="outline" onClick={() => onClick("google")}>
                <FcGoogle className="h-5 w-5"/>
            </ButtonShad>

{/*            <ButtonShad size="lg" className="w-full bg-black/50 active:scale-90 transition" variant="outline" onClick={() => onClick("microsoft")}>
                <FaMicrosoft className="h-5 w-5 text-white"/>
            </ButtonShad>*/}
        </div>
    );
}

export default Social;
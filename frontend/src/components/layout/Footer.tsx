import { useTranslation } from 'react-i18next';
import { useFetch } from '@/hooks/useFetch';
import { fetchSiteContent } from '@/api/content.api';
import { FaInstagram, FaFacebookF, FaTiktok } from 'react-icons/fa';

export function Footer() {
  const { data: content } = useFetch(fetchSiteContent, []);
  const { t } = useTranslation();

  const branches = [
    {
      nameHe: 'משתלת אליאסמין - ג׳ת',
      nameAr: 'مشتل الياسمين - جت',
      address: "ג'ת, ישראל",
      map: 'https://www.google.com/maps/search/?api=1&query=משתלת+אליאסמין+גت',
    },
    {
      nameHe: 'משתלת אליאסמין - כפר קרע',
      nameAr: 'مشتل الياسمين - كفر قرع',
      address: 'כפר קרע, ישראל',
      map: 'https://www.google.com/maps/search/?api=1&query=אזהאר+אליאסמין+כפר+קרע',
    },
  ];


  const instagram =
    content?.socialLinks?.instagram ??
    'https://www.instagram.com/azhar.alyasmin1?igsh=MTZlODJiNmp5anphZA==';

  const facebook =
    content?.socialLinks?.facebook ??
    'https://www.facebook.com/alyasmenjatt/?locale=he_IL';


  return (
    <footer
      className="
      mt-20
      border-t
      border-[var(--color-sage-200)]
      bg-[var(--color-sage-100)]
    "
    >

      <div
        className="
        mx-auto
        grid
        max-w-6xl
        gap-12
        px-6
        py-14
        md:grid-cols-4
      "
      >


        {/* Brand */}
        <div>

          <h3
            className="
            font-display
            text-2xl
            font-bold
            text-[var(--color-forest-800)]
          "
          >
            משתלת אליאסמין
          </h3>


          <p
            className="
            mt-2
            text-lg
            text-[var(--color-forest-700)]
          "
          >
            مشتل الياسمين
          </p>


          <p
            className="
            mt-4
            text-sm
            leading-relaxed
            text-[var(--color-ink-600)]
          "
          >
            משתלה מובילה לצמחים, פרחים ועצי נוי.
            מגוון רחב של צמחי גינה ובית,
            שירות מקצועי ומחירים מיוחדים.
          </p>


          <p
            className="
            mt-3
            text-sm
            leading-relaxed
            text-[var(--color-ink-600)]
          "
          >
            مشتل متخصص بالنباتات والزهور والأشجار،
            نقدم تشكيلة واسعة وخدمة مميزة لكل محبي الطبيعة.
          </p>

        </div>




        {/* Branches */}
        <div>

          <h4
            className="
            mb-5
            text-base
            font-bold
            text-[var(--color-forest-800)]
          "
          >
            הסניפים שלנו
            <br />
            فروعنا
          </h4>


          <div className="space-y-6">

            {branches.map((branch) => (

              <div key={branch.nameHe}>

                <h5
                  className="
                  font-semibold
                  text-[var(--color-forest-700)]
                "
                >
                  {branch.nameHe}
                </h5>


                <p className="text-sm text-[var(--color-ink-600)]">
                  {branch.nameAr}
                </p>


                <p className="mt-1 text-sm text-[var(--color-ink-600)]">
                  📍 {branch.address}
                </p>


                <a
                  href={branch.map}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                  mt-2
                  inline-block
                  text-sm
                  font-medium
                  text-[var(--color-forest-700)]
                  hover:underline
                "
                >
                  פתח מפה ←
                </a>

              </div>

            ))}

          </div>

        </div>




        {/* Contact */}
        <div>

          <h4
            className="
            mb-5
            text-base
            font-bold
            text-[var(--color-forest-800)]
          "
          >
            {t('footer.contact')}
          </h4>


          <ul
            className="
            space-y-3
            text-sm
            text-[var(--color-ink-600)]
          "
          >

            <li>
              📞 {content?.phone ?? '054-664-3896'}
            </li>


            <li>
              📍 {content?.address ?? "ג'ת, ישראל"}
            </li>

          </ul>



          <a
            href={`https://wa.me/${content?.whatsapp ?? '972546643896'}`}
            target="_blank"
            rel="noopener noreferrer"
            className="
            mt-5
            inline-flex
            rounded-full
            bg-[var(--color-forest-700)]
            px-5
            py-2.5
            text-sm
            font-semibold
            text-white
            transition
            hover:bg-[var(--color-forest-900)]
          "
          >
            💬 WhatsApp
          </a>


        </div>





        {/* Hours + Social */}
        <div>


          <h4
            className="
            mb-5
            text-base
            font-bold
            text-[var(--color-forest-800)]
          "
          >
            {t('footer.hours')}
          </h4>



          {content?.openingHours?.length ? (

            <ul
              className="
              space-y-2
              text-sm
              text-[var(--color-ink-600)]
            "
            >

              {content.openingHours.map((h) => (

                <li key={h.day}>
                  {h.day}: {h.open} - {h.close}
                </li>

              ))}

            </ul>

          ) : (

            <p className="text-sm text-[var(--color-ink-600)]">
              {t('footer.hoursSoon')}
            </p>

          )}




          {/* Social Media */}

          <div className="mt-7">

            <h5
              className="
              mb-4
              text-sm
              font-semibold
              text-[var(--color-forest-800)]
            "
            >
              עקבו אחרינו
              <br />
              تابعونا
            </h5>



            <div className="flex gap-3">


              <a
                href={instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-full
                bg-white
                text-xl
                text-[var(--color-forest-700)]
                shadow-sm
                transition
                hover:-translate-y-1
                hover:shadow-md
              "
              >
                <FaInstagram />
              </a>



              <a
                href={facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-full
                bg-white
                text-xl
                text-[var(--color-forest-700)]
                shadow-sm
                transition
                hover:-translate-y-1
                hover:shadow-md
              "
              >
                <FaFacebookF />
              </a>



              {content?.socialLinks?.tiktok && (

                <a
                  href={content.socialLinks.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok"
                  className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-full
                  bg-white
                  text-xl
                  text-[var(--color-forest-700)]
                  shadow-sm
                  transition
                  hover:-translate-y-1
                  hover:shadow-md
                "
                >
                  <FaTiktok />
                </a>

              )}


            </div>

          </div>


        </div>


      </div>




      <div
        className="
        border-t
        border-[var(--color-sage-200)]
        py-5
        text-center
        text-xs
        text-[var(--color-ink-600)]
      "
      >

        © {new Date().getFullYear()}
        משתלת אליאסמין | مشتل الياسمين

      </div>


    </footer>
  );
}
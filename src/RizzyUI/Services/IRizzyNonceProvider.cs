using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RizzyUI.Services;

/// <summary>
/// Service interface for providing CSP nonce values on a scoped basis.
/// </summary>
public interface IRizzyNonceProvider
{
    /// <summary>
    /// Gets the nonce values for the current request.
    /// </summary>
    RizzyNonceValues GetNonceValues();
}
